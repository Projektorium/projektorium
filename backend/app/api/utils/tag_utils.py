from typing import Sequence, TypeAlias

import numpy as np
from numpy.typing import NDArray


from sqlmodel import Session, col, select
from sqlalchemy.orm import selectinload
from collections import OrderedDict
from app.models.common import get_zero_vector


from app.core.embeddings import Embedder
from app.core.spell.spellCheker import SpellChecker

from app.models.tag import NormalizedTag, Tag
from app.schemas.tag import TagCreate


TagName: TypeAlias = str         # Original user-provided tag name
NormalizedName: TypeAlias = str  # Normalized tag name (after spell check)


def __fetch_existing_tags(session: Session, names: list[TagName]) -> dict[TagName, Tag]:
    """Fetch existing tags with their normalized tags."""
    existing = session.exec(
        select(Tag).options(selectinload(Tag.normalized_tag))  # type: ignore
        .where(col(Tag.name).in_(names))
    ).all()

    return {t.name: t for t in existing}


def __get_or_create_normalized_tags(
    session: Session,
    embedder: Embedder,
    normalized_names: list[NormalizedName]
) -> tuple[list[NormalizedTag], dict[NormalizedName, NormalizedTag]]:
    """
    Returns
        tuple:
            - the list of newly created normalized tags
            - the map (normalized name, NormalizedTag) that contains both existing NormalizedTags and newly created
    """
    unique_normalized_names = list(OrderedDict.fromkeys(normalized_names))

    # Check which normalized tags already exist
    existing_normalized = session.exec(
        select(NormalizedTag).where(
            col(NormalizedTag.name).in_(unique_normalized_names))
    ).all()

    name_to_norm_tag = {t.name: t for t in existing_normalized}

    normalized_tags_to_create = [
        n for n in unique_normalized_names if n not in name_to_norm_tag
    ]

    new_normalized_tags: list[NormalizedTag] = []

    if normalized_tags_to_create:
        # Get embeddings for all new normalized tags at once
        embeddings = embedder.encode(normalized_tags_to_create)

        new_normalized_tags = [
            NormalizedTag(name=name, embedding=embeddings[i])
            for i, name in enumerate(normalized_tags_to_create)
        ]

        # Update the map normalized map
        for tag_name, tag in zip(normalized_tags_to_create, new_normalized_tags):
            name_to_norm_tag[tag_name] = tag

    return (new_normalized_tags, name_to_norm_tag)


def get_or_create_tags(
    session: Session,
    spellCheker: SpellChecker,
    embedder: Embedder,
    tag_ins: Sequence[TagCreate | dict[str, str]]
) -> tuple[list[Tag], NDArray[np.float64]]:
    """
    Returns:
        tuple:
            - List of Tag objects in the same order as the input
            - Mean embedding vector of all tags
    """
    names: list[TagName] = [tag_in["name"] if isinstance(tag_in, dict) else
                            tag_in.name for tag_in in tag_ins]

    if not names:
        return ([], get_zero_vector())

    # Select existing tags and laod their normalized tags.
    existing_map = __fetch_existing_tags(session, names)

    # Tags that need to be created.
    tags_to_create = [n for n in names if n not in existing_map]

    # Initially store the embeddings of all the tags that already existed in the db.
    all_embeddings = [existing_map[tag_name].normalized_tag.embedding for tag_name in names
                      if tag_name in existing_map]

    if not tags_to_create:
        return ([existing_map[name] for name in names], np.mean(all_embeddings, axis=0))

    name_to_norm_name: dict[TagName, NormalizedName] = {
        name: spellCheker.get_normalized(name) for name in tags_to_create
    }

    norm_tags_to_create = list(name_to_norm_name.values())

    new_normalized_tags, norm_name_to_normtag = __get_or_create_normalized_tags(
        session, embedder, norm_tags_to_create
    )

    new_tags = {
        tag_name: Tag(
            name=tag_name, normalized_tag=norm_name_to_normtag[name_to_norm_name[tag_name]]
        ) for tag_name in tags_to_create
    }

    # Add the embeddings of allthe tags that were not initially present in the database.
    for tag_name in tags_to_create:
        norm_name = name_to_norm_name.get(tag_name)
        if norm_name and norm_name in norm_name_to_normtag:
            all_embeddings.append(norm_name_to_normtag[norm_name].embedding)

    all_tags = []
    for name in names:
        if name in existing_map:
            all_tags.append(existing_map[name])
        elif name in new_tags:
            all_tags.append(new_tags[name])

    session.add_all(new_normalized_tags)
    session.add_all(new_tags.values())

    mean_embedding = np.mean(
        all_embeddings, axis=0) if all_embeddings else get_zero_vector()

    return (all_tags, mean_embedding)
