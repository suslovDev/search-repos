let form = document.getElementById("form");
let searchBlock = document.getElementById("search");
let input = document.getElementById("input");
let reposBlock = document.getElementById("repos");
let foundHeading = document.getElementById("heading");

const createTag = (tagName, cssClass, content = null) => {
  let tag = document.createElement(tagName);
  tag.classList.add(cssClass);
  if (content) tag.textContent = content;
  return tag;
};

const createAnchor = (attrs, content) => {
  let anchor = document.createElement("a");
  anchor.innerHTML = content;
  attrs.forEach((attr) => {
    anchor.setAttribute(attr.name, attr.value);
  });
  return anchor;
};

const setHeadingMessage = (message) => {
  foundHeading.textContent = message;
};

const showWarning = () => {
  let warn = document.createElement("span");
  warn.textContent = "Продолжайте печать...";
  warn.classList.add("warn");
  searchBlock.append(warn);
  setTimeout(() => warn.remove(), 2000);
};

const searchRepos = async () => {
  let queryString = `https://api.github.com/search/repositories?q=${input.value}in:name&per_page=10`;

  try {
    let response = await fetch(queryString);
    let result = await response.json();
    let foundRepos = result.items;
    let hasRepos = !!foundRepos.length;
    let headingMessage = hasRepos
      ? "Список найденных репозиториев:"
      : "Ничего не найдено";
    setHeadingMessage(headingMessage);
    foundRepos.forEach((repo) => {
      addRepoCard(
        repo.name,
        repo.language,
        repo.html_url,
        repo.owner.login,
        repo.owner.avatar_url
      );
    });
  } catch {
    console.log("Что-то пошло не так(");
  }
};

const handleSubmit = (e) => {
  e.preventDefault();
  if (input.value.trim().length < 4) {
    showWarning();
    input.focus();
    return;
  }
  reposBlock.innerHTML = "";
  searchRepos();
};

const addRepoCard = (nameRepo, language, href, owner, avatar) => {
  language = language ? language : "Elfin(no code)";
  let repoCard = createTag("div", "repo-card");
  let avatarElem = createTag("div", "repo-card__avatar");
  avatarElem.style.cssText = `background: url(${avatar}) center/cover`;

  repoCard.append(avatarElem);

  let anchor = createAnchor(
    [
      { name: "target", value: "_blank" },
      { name: "href", value: href },
    ],
    nameRepo
  );
  let repoCardTitle = createTag("h3", "repo-card__title");

  repoCardTitle.append(anchor);

  let repoCardList = createTag("ul", "repo-card__list");
  let repoCardLang = createTag(
    "li",
    "repo-card__list-item",
    `Язык: ${language}`
  );
  let repoCardOwn = createTag(
    "li",
    "repo-card__list-item",
    `Владелец: ${owner}`
  );

  repoCardList.append(repoCardLang, repoCardOwn);
  repoCard.append(repoCardTitle, repoCardList);
  reposBlock.append(repoCard);
};

form.addEventListener("submit", handleSubmit);

input.focus();
