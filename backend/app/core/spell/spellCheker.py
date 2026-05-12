import re
from pathlib import Path
from symspellpy import SymSpell, Verbosity # type: ignore


class SpellChecker():
    def __init__(self, dict_path: str = "word_frequencies_fact.txt"):
        dict_p = Path(__file__).parent/dict_path
        self.__sym_spell = SymSpell(max_dictionary_edit_distance=2, prefix_length=7)
        self.__sym_spell.load_dictionary(dict_p, separator=' ', encoding='utf-8', term_index=0, count_index=1)

    def get_normalized(self, word: str) -> str:
        suggestions = self.__sym_spell.lookup(word.lower(), Verbosity.CLOSEST,
                                              max_edit_distance=2, include_unknown=True)
        # include_unknown ensures the list won't be empty for unknown words.
        best = suggestions[0]
        return best.term

    def clean_markdown(self, text: str) -> str:
        return re.sub(r'\*+', '', text)



spell_check = SpellChecker()

def get_spell_checker() -> SpellChecker:
    return spell_check