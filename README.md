# Projektorium

Platforma łącząca studentów z projektami naukowymi i badawczymi. Użytkownicy mogą przeglądać projekty, aplikować na otwarte stanowiska oraz nawiązywać kontakt z właścicielami projektów.

---

## Spis treści

- [Stack technologiczny](#stack-technologiczny)
- [Design aplikacji](#design-aplikacji)
- [Przypadki użycia](#przypadki-użycia)
- [Architektura systemu](#architektura-systemu)
- [Szybki start](#szybki-start)
- [Konfiguracja projektu](#konfiguracja-projektu)
- [Alternatywa: Copier](#alternatywa-copier)
- [Dokumentacja szczegółowa](#dokumentacja-szczegółowa)
- [Licencja](#licencja)

---

## Stack technologiczny

### Backend

| Technologia | Zastosowanie |
|-------------|--------------|
| [FastAPI](https://fastapi.tiangolo.com) | Framework REST API |
| [SQLModel](https://sqlmodel.tiangolo.com) | ORM / interakcje z bazą SQL |
| [Pydantic](https://docs.pydantic.dev) | Walidacja danych i konfiguracji |
| [PostgreSQL](https://www.postgresql.org) | Relacyjna baza danych |
| [Alembic](https://alembic.sqlalchemy.org) | Migracje schematu bazy danych |
| [Pytest](https://pytest.org) | Testy jednostkowe i integracyjne |

**Funkcjonalności backendu:**
- Uwierzytelnianie JWT (JSON Web Token)
- Bezpieczne haszowanie haseł (bcrypt)
- Odzyskiwanie hasła przez e-mail
- Automatycznie generowana dokumentacja API (Swagger UI / ReDoc)

### Frontend

| Technologia | Zastosowanie |
|-------------|--------------|
| [React](https://react.dev) | Framework UI |
| TypeScript + Vite | Język i bundler |
| [Chakra UI](https://chakra-ui.com) | Biblioteka komponentów |
| [Playwright](https://playwright.dev) | Testy End-to-End |

**Funkcjonalności frontendu:**
- Automatycznie generowany klient API (typowany)
- Wyszukiwarka projektów i użytkowników
- System wiadomości i powiadomień
- Rekomendacje projektów

### Infrastruktura i DevOps

| Technologia | Zastosowanie |
|-------------|--------------|
| [Docker Compose](https://www.docker.com) | Środowisko developerskie i produkcyjne |
| [Traefik](https://traefik.io) | Reverse proxy / load balancer + TLS |
| GitHub Actions | CI (testy) i CD (deployment) |

---

## Design aplikacji

Design został opracowany we współpracy z projektantem w narzędziu Figma, na podstawie naszej wizji i przeprowadzonych badań społecznych.

### Logowanie

[![Login](img/Login.png)](img/Login.png)

Strona służy do logowania użytkownika. Pole **Email** przyjmuje adres e-mail, pole **Hasło** przyjmuje hasło. Kliknięcie przycisku logowania inicjuje sesję. Linki **Zapomniałeś hasła** i **Załóż konto** przekierowują odpowiednio do odzyskiwania hasła i rejestracji.

### Pasek nawigacji (Navbar)

[![Navbar](img/Navbar.png)](img/Navbar.png)

Navbar występuje w dwóch wariantach — z wyszukiwarką projektów/użytkowników lub bez niej. Oba zawierają dzwonek powiadomień oraz menu użytkownika:

<p align="center">
  <img src="img/UserMenu.png" width="250" alt="User Menu" />
</p>

Opcje menu użytkownika:

| Opcja | Akcja |
|-------|-------|
| Zapisane | Przekierowanie do polubionych projektów |
| Mój profil | Przekierowanie do profilu użytkownika |
| Moje Projekty | Przekierowanie do projektów użytkownika |
| Wyloguj | Wylogowanie i przekierowanie do strony logowania |

### Projekt

[![Project](img/Project.png)](img/Project.png)

Kafelek projektu zawiera tytuł, opis i tagi. Kliknięcie otwiera stronę główną projektu. Ikona oka służy do ukrycia projektu, serce — do polubienia.

[![Project Main Page](img/ProjectMainPage.png)](img/ProjectMainPage.png)

Na stronie głównej projektu dostępne są:
- Przycisk **Kontakt** — do komunikacji z właścicielem projektu
- Lista otwartych stanowisk z przyciskiem **Aplikuj**
- Sekcja **Uczestnicy** — lista uczestników z zdjęciem, imieniem i opisem roli
- Sekcja **Załączniki** — pliki powiązane z projektem
- Sekcja **Publikacje** — powiązane publikacje naukowe

### Profil użytkownika

[![User Profile](img/UserProfile.png)](img/UserProfile.png)

Profil użytkownika jest analogiczny do strony głównej projektu, z dodatkowym zdjęciem profilowym, sekcją "O mnie", tagami umiejętności oraz listą projektów użytkownika.

### Rekomendacje

[![User Recommendation](img/UserRecommendation.png)](img/UserRecommendation.png)

Rekomendacje prezentowane są jako lista projektów lub użytkowników. Kliknięcie elementu przekierowuje na odpowiednią stronę główną. Na dole strony znajduje się paginacja.

### Wiadomości

[![Messages](img/Messages.png)](img/Messages.png)

Każda wiadomość zawiera tytuł, treść i datę wysłania. Dostępne akcje:
- **Napisz** — odpowiedź na wiadomość
- **Udostępnij dane** — wysłanie danych kontaktowych

### Modal

[![Modal](img/Modal.png)](img/Modal.png)

Modalne okna dialogowe używane są w różnych miejscach platformy (np. aplikowanie na stanowisko). Zawierają tytuł (np. **Aplikuj**), treść formularza oraz przycisk **Wyślij**.

---

## Przypadki użycia

### Przypadek 1 — Poszukujący projektu

Typowa ścieżka studenta szukającego projektu naukowego:

1. **Logowanie** — użytkownik otwiera stronę logowania. Jeśli nie ma konta, rejestruje się, po czym wraca do logowania.
2. **Rekomendacje** — po zalogowaniu użytkownik trafia na stronę główną z rekomendowanymi projektami.
3. **Uzupełnienie profilu** — przez menu użytkownika przechodzi do *Mój profil*, gdzie dodaje opis, zdjęcie profilowe i tagi umiejętności.
4. **Wyszukiwanie** — wpisuje zapytanie w wyszukiwarkę na navbarze i przegląda listę pasujących projektów. Polubione projekty zapisuje sercem.
5. **Przeglądanie projektu** — klika wybrany projekt, czyta opis i listę stanowisk.
6. **Kontakt** — używa przycisku *Kontakt*, aby napisać do właściciela projektu z pytaniami.
7. **Aplikowanie** — po wymianie wiadomości klika *Aplikuj* przy interesującym go stanowisku i wysyła formularz przez modal.
8. **Wylogowanie** — po przyjęciu aplikacji wylogowuje się z platformy.

### Przypadek 2 — Właściciel projektu

Ścieżka prowadzącego projekt badawczego:

1. **Logowanie** — użytkownik loguje się na swoje konto.
2. **Zarządzanie projektami** — przez menu użytkownika przechodzi do *Moje Projekty* i tworzy nowy projekt przyciskiem plus.
3. **Konfiguracja projektu** — na stronie projektu dodaje opis, tagi oraz otwarte stanowiska.
4. **Wyszukiwanie kandydatów** — korzysta z wyszukiwarki, żeby znaleźć użytkowników o odpowiednich umiejętnościach. Po wejściu na profil kandydata kontaktuje go przez wiadomość.
5. **Obsługa aplikacji** — odbiera aplikacje od użytkowników, którzy znaleźli projekt przez wyszukiwarkę lub rekomendacje, a następnie akceptuje lub odrzuca wybrane.
6. **Wylogowanie** — kończy sesję po skompletowaniu zespołu.

### Przypadek 3 — Przeglądający (niezalogowany)

Ścieżka użytkownika eksplorującego platformę przed rejestracją:

1. **Przeglądanie projektów** — użytkownik wchodzi na stronę i bez logowania może przeglądać publiczne projekty oraz profile uczestników.
2. **Szczegóły projektu** — klika wybrany projekt, czyta opis, listę stanowisk i uczestników.
3. **Profil uczestnika** — klika uczestnika projektu, żeby zobaczyć jego profil i inne projekty, w których bierze udział.
4. **Rejestracja** — zainspirowany znalezionymi projektami klika *Załóż konto* na stronie logowania, rejestruje się i wraca do przeglądania już jako zalogowany użytkownik z dostępem do aplikowania i wiadomości.

---

## Architektura systemu

Design aplikacji ułatwił zrozumienie przepływu danych, co pozwoliło na modelowanie komunikacji między frontendem a backendem.

### Uwierzytelnianie

Użytkownik przesyła e-mail i hasło do backendu i otrzymuje token JWT, który jest dołączany do każdego żądania modyfikującego stan aplikacji. Projekty i profile są publiczne i nie wymagają uwierzytelnienia.

### Zasoby (Projekty i Profile)

| Zasób | Pola |
|-------|------|
| Profil | imię, opis, tagi, lista projektów, zdjęcie profilowe |
| Projekt | tytuł, opis, stanowiska, uczestnicy, załączniki, publikacje |

Backend udostępnia endpointy GET do odczytu profili i projektów oraz PUT/DELETE do ich aktualizacji i usuwania przez uprawnionych użytkowników.

### Dodatkowe funkcjonalności

- **Aplikowanie** — po kliknięciu *Aplikuj* dane formularza trafiają do bazy; właściciel projektu zostaje powiadomiony.
- **Wiadomości** — kliknięcie *Wyślij* zapisuje treść wiadomości w bazie i powiadamia odbiorcę.
- **Polubienia** — endpoint aktualizujący stan polubienia projektu przez użytkownika.
- **Wyszukiwanie** — wyspecjalizowany endpoint zwracający listę projektów lub użytkowników na podstawie zapytania.
- **Rekomendacje** — dedykowany endpoint zwracający spersonalizowaną listę projektów i użytkowników.

---

## Wymagania wstępne

Przed pierwszym uruchomieniem zainstaluj poniższe narzędzia.

### Wymagane (ścieżka Docker — zalecana)

| Narzędzie | Minimalna wersja | Instalacja |
|-----------|-----------------|------------|
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows / macOS) lub [Docker Engine](https://docs.docker.com/engine/install/) + [Docker Compose](https://docs.docker.com/compose/install/) (Linux) | Docker Compose **v2.22+** (wymagane przez `watch`) | [docs.docker.com](https://docs.docker.com/get-started/get-docker/) |
| [Git](https://git-scm.com/) | dowolna | [git-scm.com](https://git-scm.com/downloads) |

> Sprawdź wersję Docker Compose: `docker compose version`

### Opcjonalne (lokalne uruchomienie bez Dockera)

Potrzebne tylko gdy chcesz uruchamiać backend lub frontend **bezpośrednio na hoście** zamiast przez Docker:

| Narzędzie | Wersja | Do czego |
|-----------|--------|----------|
| [Python](https://www.python.org/) | 3.10+ | Backend |
| [uv](https://docs.astral.sh/uv/) | dowolna | Zarządzanie zależnościami Pythona |
| [Node.js](https://nodejs.org/) | **20** (patrz `frontend/.nvmrc`) | Frontend |
| [nvm](https://github.com/nvm-sh/nvm) lub [fnm](https://github.com/Schniz/fnm) | dowolna | Zarządzanie wersjami Node.js |

---

## Szybki start

### 1. Klonowanie repozytorium

**Repozytorium publiczne:**

```bash
git clone git@github.com:fastapi/full-stack-fastapi-template.git my-full-stack
cd my-full-stack
```

**Repozytorium prywatne** (GitHub nie pozwala zmieniać widoczności forków):

```bash
git clone git@github.com:fastapi/full-stack-fastapi-template.git my-full-stack
cd my-full-stack

# Ustaw nowy origin (Twoje repozytorium)
git remote set-url origin git@github.com:octocat/my-full-stack.git

# Zachowaj upstream do pobierania aktualizacji szablonu
git remote add upstream git@github.com:fastapi/full-stack-fastapi-template.git

git push -u origin master
```

### 2. Konfiguracja `.env`

Plik `.env` już istnieje w repozytorium z domyślnymi wartościami gotowymi do lokalnego developmentu — **nie musisz go tworzyć ręcznie**. Jedyna zmiana potrzebna przed pierwszym uruchomieniem to opcjonalne ustawienie własnych haseł (patrz sekcja [Zmienne środowiskowe](#zmienne-środowiskowe)).

Token do embedingów
HF_TOKEN= 


### 3. Uruchomienie

```bash
docker compose watch
```

Komenda `watch` uruchamia cały stack i automatycznie synchronizuje zmiany w kodzie z kontenerami (hot-reload). Wymaga Docker Compose **v2.22+**.

Po uruchomieniu dostępne są:

| Usługa | URL |
|--------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| Swagger UI | http://localhost:8000/docs |
| ReDoc | http://localhost:8000/redoc |
| Adminer (DB) | http://localhost:8080 |
| Traefik UI | http://localhost:8090 |
| MailCatcher | http://localhost:1080 |

> **Uwaga:** Przy pierwszym uruchomieniu backend czeka na gotowość bazy danych — może to chwilę potrwać. Sprawdź logi przez `docker compose logs`.

### 4. Lokalne uruchomienie bez Dockera (opcjonalne)

Możesz zatrzymać wybraną usługę Dockera i uruchomić ją bezpośrednio na hoście — przydatne przy intensywnym debugowaniu.

**Backend:**

```bash
docker compose stop backend
cd backend
uv sync                        # instalacja zależności
source .venv/bin/activate      # (Linux/macOS) lub .venv\Scripts\activate (Windows)
fastapi dev app/main.py
```

**Frontend:**

```bash
docker compose stop frontend
cd frontend
nvm use   # lub: fnm use       # przełącza na Node 20 z .nvmrc
npm install
npm run dev
```

Szczegóły w [development.md](./development.md).

---

## Konfiguracja projektu

### Zmienne środowiskowe

Konfiguracja przechowywana jest w pliku `.env`. Przed wdrożeniem **obowiązkowo** zmień:

| Zmienna | Domyślna wartość | Opis |
|---------|-----------------|------|
| `SECRET_KEY` | `changethis` | Klucz do podpisywania tokenów JWT |
| `FIRST_SUPERUSER_PASSWORD` | `changethis` | Hasło pierwszego administratora |
| `POSTGRES_PASSWORD` | `changethis` | Hasło bazy danych |

Pozostałe zmienne konfiguracyjne:

```dotenv
PROJECT_NAME="Full Stack FastAPI Project"
DOMAIN=localhost
ENVIRONMENT=local                          # local | staging | production
FIRST_SUPERUSER=admin@example.com

# Email (SMTP)
SMTP_HOST=
SMTP_USER=
SMTP_PASSWORD=
EMAILS_FROM_EMAIL=info@example.com
SMTP_PORT=587

# PostgreSQL
POSTGRES_SERVER=localhost
POSTGRES_PORT=5432
POSTGRES_DB=app
POSTGRES_USER=postgres

# Sentry (opcjonalne)
SENTRY_DSN=
```

### Generowanie bezpiecznych kluczy

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Uruchom polecenie osobno dla `SECRET_KEY` i `POSTGRES_PASSWORD`.

### Aktualizacja z oryginalnego szablonu

```bash
git pull --no-commit upstream master
# Rozwiąż konflikty, następnie:
git merge --continue
```

---

## Alternatywa: Copier

[Copier](https://copier.readthedocs.io) automatycznie kopiuje pliki projektu i uzupełnia `.env` na podstawie odpowiedzi na pytania konfiguracyjne.

### Instalacja

```bash
pip install copier
# lub z pipx (zalecane):
pipx install copier
```

### Generowanie projektu

```bash
copier copy https://github.com/fastapi/full-stack-fastapi-template my-awesome-project --trust
```

> Flaga `--trust` jest wymagana do uruchomienia [skryptu post-inicjalizacyjnego](https://github.com/fastapi/full-stack-fastapi-template/blob/master/.copier/update_dotenv.py).

### Zmienne wejściowe Copier

| Zmienna | Domyślna | Opis |
|---------|----------|------|
| `project_name` | `"FastAPI Project"` | Nazwa projektu widoczna w API |
| `stack_name` | `"fastapi-project"` | Nazwa stacku Docker Compose (bez spacji i kropek) |
| `secret_key` | `"changethis"` | Klucz bezpieczeństwa JWT |
| `first_superuser` | `"admin@example.com"` | Email pierwszego admina |
| `first_superuser_password` | `"changethis"` | Hasło pierwszego admina |
| `smtp_host` | `""` | Serwer SMTP |
| `smtp_user` | `""` | Użytkownik SMTP |
| `smtp_password` | `""` | Hasło SMTP |
| `emails_from_email` | `"info@example.com"` | Adres nadawcy e-maili |
| `postgres_password` | `"changethis"` | Hasło PostgreSQL |
| `sentry_dsn` | `""` | DSN Sentry (opcjonalne) |

---

## Dokumentacja szczegółowa

| Temat | Plik |
|-------|------|
| Rozwój backendu | [backend/README.md](./backend/README.md) |
| Rozwój frontendu | [frontend/README.md](./frontend/README.md) |
| Środowisko developerskie | [development.md](./development.md) |
| Wdrożenie produkcyjne | [deployment.md](./deployment.md) |
| Historia zmian | [release-notes.md](./release-notes.md) |

---

## Licencja

Projekt objęty licencją [MIT](./LICENSE).
