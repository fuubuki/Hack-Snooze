"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  // if a user is logged in, show favorite/not-favorite stars
  const showStar = Boolean(currentUser);
  let showTrashCan = false;
  Boolean(currentUser) ? showTrashCan = currentUser.isUserStory(story) : showTrashCan = false;

  return $(`
      <li id="${story.storyId}">
        ${showStar ? getStarHTML(currentUser, story) : ""}
        ${showTrashCan ? getTrashcanHTML() : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Make favorite/not-favorite star for story */

function getStarHTML(user, story) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
      <span class="star">
        <i class="${starType} fa-star"></i>
      </span>`;
}

/** Make trash can for deleting user stories */

function getTrashcanHTML() {
  return `
      <span class="trash-can">
        <i class="fas fa-trash-alt"></i>
      </span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();
  $allFavoriteStoriesList.hide();
  $allMyStoriesList.hide();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Gets list of user favorite stories, generates their HTML, and puts on page.  */

function putFavoriteStoriesOnPage() {
  console.debug("putFavoriteStoriesOnPage");

  $allFavoriteStoriesList.empty();
  $allStoriesList.hide();
  $allMyStoriesList.hide();

  // loop through all of user favorite stories and generate HTML for them
  if(currentUser.favorites.length <= 0) {
    $allFavoriteStoriesList.append("<h5>No favorites added!</h5>");
  } else {
    for(let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $allFavoriteStoriesList.append($story);
    }
  }
  
  $allFavoriteStoriesList.show();
}

/** Gets all user's stories, generates their HTML, and puts on page.  */

function putMyStoriesOnPage() {
  console.debug("putMyStoriesOnPage");

  $allMyStoriesList.empty();
  $allStoriesList.hide();
  $allFavoriteStoriesList.hide();

  // loop through all user's stories and generate HTML for them
  if(currentUser.ownStories.length <= 0) {
    $allMyStoriesList.append("<h5>No stories submitted!</h5>");
  } else {
    for(let story of currentUser.ownStories) {
      const $story = generateStoryMarkup(story);
      $allMyStoriesList.append($story);
    }
  }

  $allMyStoriesList.show();
}

/** Handle submit story form submission */

async function submitForm(evt) {
  console.debug("submitForm", evt);
  evt.preventDefault();

  // grab author, title, url
  const author = $("#create-author").val();
  const title = $("#create-title").val();
  const url = $("#create-url").val();
  const username = currentUser.username;

  const story = await storyList.addStory(currentUser, {title, author, url, username});
  currentUser.ownStories.push(story);

  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  $submitForm.slideUp("slow");
  $submitForm.trigger("reset");
} 

$submitForm.on("submit", submitForm);

//** Handle favoriting/unfavoriting stories */

async function toggleStoryFavorite(evt) {
  console.debug("toggleStoryFavorite", evt.target);
  evt.preventDefault();

  const $target = $(evt.target);
  const $closestLi = $target.closest('li');
  const storyId = $closestLi.attr('id');
  const story = storyList.stories.find(s => s.storyId === storyId);

  if($target.hasClass('far')) {
    await currentUser.addFavorite(story);
    $target.closest('i').toggleClass("fas far");
  }
  else {
    await currentUser.removeFavorite(story);
    $target.closest('i').toggleClass("far fas");
  }
}

$allStoriesList.on("click", ".star", toggleStoryFavorite);
$allFavoriteStoriesList.on("click", ".star", toggleStoryFavorite);
$allMyStoriesList.on("click", ".star", toggleStoryFavorite);

//** Handle deleting user's stories */

async function deleteUserStory(evt) {
  console.debug("deleteUserStory");
  evt.preventDefault();

  const $target = $(evt.target);
  const $closestLi = $target.closest('li');
  const storyId = $closestLi.attr('id');
  const story = currentUser.ownStories.find(s => s.storyId === storyId);

  await currentUser.removeStory(story);

  $closestLi.remove();
}

$allStoriesList.on("click", ".trash-can", deleteUserStory);
$allFavoriteStoriesList.on("click", ".trash-can", deleteUserStory);
$allMyStoriesList.on("click", ".trash-can", deleteUserStory);
