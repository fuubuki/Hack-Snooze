"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  hidePageComponents();
  if(Boolean(currentUser))
    $mainNavLinks.hide();
  else 
    $mainNavLinks.show();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show submit story on click on "submit" */

function navSubmitStoryClick(evt) {
  hidePageComponents();
  putStoriesOnPage();
  $submitForm.show();
}

$navSubmitStory.on("click", navSubmitStoryClick);

/** Show favorite list of all user favorite stories when click on "favorites"  */

function navFavorites(evt) {
  hidePageComponents();
  putFavoriteStoriesOnPage();
}

$body.on("click", "#nav-favorites", navFavorites);

/** Show user their list of stories when clik on "my stories" */

function navMyStories(evt) {
  hidePageComponents();
  putMyStoriesOnPage();
}

$body.on("click", "#nav-my-stories", navMyStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}


