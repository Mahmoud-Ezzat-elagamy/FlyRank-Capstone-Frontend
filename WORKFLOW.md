## Diffs

#### First Prompt (Lazy Promp)

Prompt: Create a userProfile page

In this case:
-The agent create a full code in one component and used logic java script in the same component which is very messy
-The agent don't create a feature to edit the useInfo
-Styling was in a card shape while the full page is only for one user

#### Second Prompt (Datailed Prompt)

Prompt: Role: midlevel Front end engineer react

Task: Create a profile feature in my intended market webpage

Context: this profile will have two Routes
-one for the user data that include Email, Name, password and location
-route for editing user data not including the email
-use useForms hook in this form
-consider the loading state 'for now make a virtual loading for 2s'
-create a loading spinner component and make it inside the save button and make the button disabled while loading
-consider the cancel button to neglect changes
-don't make information in card make it use the full page
-create a side nav column that have the user image in the top of it and have two links for now [Profile, edit] or any more related names you see
-for changing the password ask him to enter the past one first for security
-for the new password make him enter the pass twice
-make the password at least 8 chars containg one at least capital character
-conseder handling errors show and error message to user in case of invalid data
-make the page responsive
-use simple css
-consider :hover
-consider accessablity

In This Case:
-I attached a context that have exactly the shape i want this page to be like which saves alot of time .
-It took about 7 minutes to writes this prompt but got the full page done saving around, 30 minutes of debugging.
-Agent used custom hooks to separate the logic from the component view.
-Considering Hover, Accessability, Loading, Error and confirmation of data.

### What will be added to the RULES.md file

-use custom hook to separate the logic from the component
-don't make component sizes look very big and messy
-use useForms hook
-make a labed for each input field and consider the error state
-consider loading state for submitting any form
-if the form will edit data add cancel button to discard the changes done
-make button disabled while loading to avoid multi API calls
-consider responsiveness for each component built
