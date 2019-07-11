/* 
Final Project: Create a grade book program without removing or modifying the HTML or CSS provided.
Requirements: 
    - You must be able to add an assignment that will be displayed in the container grid.
    - You must be able to remove an assignment that has already been displayed in the container grid.
    - The form should not submit unless all fields have been entered.
Extra Credit: 
    - Check for information that has been entered incorrectly, and either alert the user to fix this or properly format the data for the user.
    - Keep separate averages by subject, or try adding weighted grades based on assignment type.
Notes:
    - You may add any new features that you see fit, but ensure that any new changes meet the requirements above.
    - You may only add HTML and CSS if you are implementing new features not required. However, please add comments where these changes have been added in the code. Remember, do not remove or modify any prexisting HTML or CSS.
*/

const DOM_SUBJECT = "subject"
const DOM_ASSIGNMENT = "assignment"
const DOM_SCORE = "score"
const DOM_SUBMIT_BUTTON = "submit"
const DOM_GRADE_TABLE = "container"

//Module that handles all of the data, keeping it encapsulated
const dataModule = (function() {
  let idCounter = 0

  class Entry {
    constructor(id, subject, assignment, score) {
      this.id = id
      this.subject = subject
      this.assignment = assignment
      this.score = parseInt(score)
    }
  }

  class Subject {
    constructor(scoreInput) {
      this.numberOfAssignments = 1
      this.sumOfScores = scoreInput
    }
  }

  const subjectAveragesMap = new Map()

  // Originally was going to use an array to store elements, but decided on a key-value
  // pair so we don't have to iterate over each element when deleting. #performance
  const data = {
    entries: {},
    subjects: {},
    combinedScores: 0,
    overallAverage: 0
  }

  function calculateOverallAverage() {
    const objectLength = Object.keys(data.entries).length
    data.overallAverage = Math.round(data.combinedScores / objectLength)
  }

  function addSubjectAverage(subjectInput, scoreInput) {
    if (data.subjects.hasOwnProperty(subjectInput)) {
      const targetSubject = data.subjects[subjectInput]
      targetSubject.numberOfAssignments++
      targetSubject.sumOfScores += scoreInput
    } else {
      const newSubject = new Subject(scoreInput)
      data.subjects[subjectInput] = newSubject
    }
  }

  function deleteSubjectAverage(subjectInput, scoreInput) {
    const targetSubject = data.subjects[subjectInput]

    targetSubject.sumOfScores -= scoreInput
    targetSubject.numberOfAssignments--

    if (targetSubject.numberOfAssignments == 0) {
      delete data.subjects[subjectInput]
    }
  }

  function calculateSubjectAverages() {
    const subjectsArray = Object.keys(data.subjects)

    subjectAveragesMap.clear()

    subjectsArray.forEach(currentSubject => {
      currentTargetObject = data.subjects[currentSubject]

      currentSubjectAverage =
        currentTargetObject.sumOfScores /
        currentTargetObject.numberOfAssignments

      subjectAveragesMap.set(currentSubject, currentSubjectAverage)
    })
  }

  return {
    addEntry: function(subject, assignment, score) {
      const newEntry = new Entry(idCounter, subject, assignment, score)
      data.entries[idCounter] = newEntry

      data.combinedScores += data.entries[idCounter].score
      calculateOverallAverage()

      addSubjectAverage(newEntry.subject, newEntry.score)

      calculateSubjectAverages()

      idCounter++
      return newEntry
    },
    deleteEntry: function(id) {
      data.combinedScores -= data.entries[id].score

      deleteSubjectAverage(data.entries[id].subject, data.entries[id].score)

      delete data.entries[id]

      calculateOverallAverage()

      calculateSubjectAverages()
    },
    getOverallAverage: function() {
      return data.overallAverage
    },
    getSubjectAveragesMap: function() {
      return subjectAveragesMap
    },
    testing: function() {
      return data
    }
  }
})()

//Module that handles all of the UI work, also encapsulated
const uiModule = (function() {
  //Provided an HTML id as id, this function will return the value within the HTML element.
  function getValue(id) {
    return document.getElementById(id).value
  }

  //Provided a string as val and an HTML id as id, this function will set the value within a specified input element to the string provided.
  function setValue(val, id) {
    document.getElementById(id).value = val
  }

  //Provided a string as val and an optional HTML id, this function will place the HTML string inside the specified HTML element. If no element is specified, it will default to container.
  function updateHTML(val, id = DOM_GRADE_TABLE) {
    document.getElementById(id).innerHTML = val
  }

  function addRowToTable(id, preparedHTML) {
    let newRow

    newRow = document.getElementById(DOM_GRADE_TABLE).insertRow()
    newRow.setAttribute("id", id)
    //Setting the innerHTML can be dangerous, since if the HTML that's inserted gets mutated unintentionally you can end up breaking your html/running
    //harmful code in the browser of the end user
    newRow.innerHTML = preparedHTML

    //Initially I planned to circumvent the HTML modification rule by detecting a click on the row, and then deleting that row
    //I came to the conclusion later that a better UI/UX would just be to insert a "Delete" column into the DOM and add a dedicated delete button
    // newRow.addEventListener("click", () => {
    //   uiModule.deleteRow(newRow.id)
    // })
  }

  function deleteRowFromTable(id) {
    const rowToDelete = document.getElementById(id)
    rowToDelete.parentNode.removeChild(rowToDelete)
  }

  function prepareHTML(id, subjectInput, assignmentInput, scoreInput) {
    const preparedHTML = `
        <td>${subjectInput}</td>
        <td>${assignmentInput}</td>
        <td>${scoreInput}</td>
        <td><i onClick="return deleteRowButtonClick(${id})" class="fas fa-trash-alt"></i></td> 
    `

    return preparedHTML
  }

  function getInput() {
    const subject = getValue(DOM_SUBJECT)
    const assignment = getValue(DOM_ASSIGNMENT)
    const score = getValue(DOM_SCORE)

    return [subject, assignment, score]
  }

  function checkInput(input) {
    if (!input[0] || !input[1] || !input[2]) {
      alert("Values missing.")
      return -1
    }
    console.log(input[2])
    if (isNaN(input[2])) {
      alert("Score must be a number!")
      return -1
    }
    if (input[2] < 0) {
      alert("Score must be a positive number!")
      return -1
    }
  }

  function formatInput(input) {
    formattedSubject = input[0].toLowerCase()
    formattedAssignment = input[1].toLowerCase()

    const returnInput = [formattedSubject, formattedAssignment, input[2]]

    return returnInput
  }

  function updateOverallAverage() {
    const TARGET_AVERAGE_ELEMENT = document.getElementById("average")
    if (isNaN(dataModule.getOverallAverage())) {
      TARGET_AVERAGE_ELEMENT.innerText = ""
    } else {
      TARGET_AVERAGE_ELEMENT.innerText = `Overall Average: ${dataModule.getOverallAverage()}`
    }
  }

  function updateSubjectAverages() {
    const TARGET_SUBJECT_AVERAGES_HEADER = document.getElementById(
      "subject-averages-header"
    )
    const TARGET_SUBJECT_AVERAGES_LIST = document.getElementById(
      "subject-averages-list"
    )

    TARGET_SUBJECT_AVERAGES_LIST.innerText = ""

    const subjectAveragesMap = dataModule.getSubjectAveragesMap()

    console.log(subjectAveragesMap.size)

    subjectAveragesMap.size > 0
      ? (TARGET_SUBJECT_AVERAGES_HEADER.innerText = "Averages by Subject:")
      : (TARGET_SUBJECT_AVERAGES_HEADER.innerText = "")

    subjectAveragesMap.forEach((currentSubjectScore, currentSubject) => {
      const newListItem = document.createElement("li")
      newListItem.innerText = `${currentSubject}: ${currentSubjectScore}`

      TARGET_SUBJECT_AVERAGES_LIST.insertAdjacentElement(
        "beforeend",
        newListItem
      )
    })
  }

  return {
    addRow: function() {
      const input = getInput()

      if (checkInput(input) === -1) {
        return
      }

      const formattedInput = formatInput(input)

      const entryObject = dataModule.addEntry(...formattedInput)

      addRowToTable(entryObject.id, prepareHTML(entryObject.id, ...input))

      updateOverallAverage()

      updateSubjectAverages()
    },
    deleteRow: function(id) {
      dataModule.deleteEntry(id)

      deleteRowFromTable(id)

      updateOverallAverage()

      updateSubjectAverages()
    }
  }
})()

//Module that provides functionality needed on page load
const mainModule = (function() {
  function addDOMElements() {
    //Declare consts to target HTML elements
    const TARGET_TR_ELEMENT = document.querySelector("tr")
    const TARGET_HEAD_ELEMENT = document.querySelector("head")
    const TARGET_BODY_ELEMENT = document.querySelector("body")
    const TARGET_TITLE_ELEMENT = document.querySelector("h1")
    const TARGET_AVERAGE_ELEMENT = document.getElementById("average")

    //Prompt the user to add their name to the title
    userNameInput = ""
    while (userNameInput === "") {
      userNameInput = window.prompt("Please enter your name:")
    }
    TARGET_TITLE_ELEMENT.innerText = `Grade book for ${userNameInput}`

    //Unhide the GPA display
    TARGET_AVERAGE_ELEMENT.setAttribute("style", "display: block")
    TARGET_AVERAGE_ELEMENT.innerText = ""

    //Insert a line break to distinguish the overall average from the subject averages
    TARGET_AVERAGE_ELEMENT.insertAdjacentHTML("afterend", "<br>")

    //Create new th column to display delete button
    const newTHColumnElement = document.createElement("th")
    newTHColumnElement.innerText = "Delete"
    TARGET_TR_ELEMENT.insertAdjacentElement("beforeend", newTHColumnElement)

    //Hook into Font Awesome for super sick trash can icon
    //Inserting this into the DOM here since we aren't allowed to modify the html
    const fontAwesomeHook = document.createElement("link")
    fontAwesomeHook.setAttribute(
      "href",
      "https://use.fontawesome.com/releases/v5.8.2/css/all.css"
    )
    fontAwesomeHook.setAttribute("rel", "stylesheet")
    TARGET_HEAD_ELEMENT.insertAdjacentElement("afterbegin", fontAwesomeHook)

    //Add elements to body to display averages by subject
    const newSubjectAveragesDivElement = document.createElement("div")
    newSubjectAveragesDivElement.setAttribute("id", "subject-averages-section")

    const newSubjectAveragesHeaderElement = document.createElement("h3")
    newSubjectAveragesHeaderElement.setAttribute(
      "id",
      "subject-averages-header"
    )

    const newSubjectAveragesUnorderedListElement = document.createElement("ul") //I hope you like verbose, specific variable names, heh...
    newSubjectAveragesUnorderedListElement.setAttribute(
      "id",
      "subject-averages-list"
    )

    newSubjectAveragesHeaderElement.innerText = ""

    TARGET_BODY_ELEMENT.insertAdjacentElement(
      "beforeend",
      newSubjectAveragesDivElement
    )

    newSubjectAveragesDivElement.insertAdjacentElement(
      "beforeend",
      newSubjectAveragesHeaderElement
    )

    newSubjectAveragesDivElement.insertAdjacentElement(
      "beforeend",
      newSubjectAveragesUnorderedListElement
    )
  }
  return {
    init: function() {
      addDOMElements()
    }
  }
})()

//Global function that is invoked when the submit button is clicked, which in turn invokes the function inside the UI Module of the same name
//A better way to do this would have been editing the onclick of the submit button in the HTML to return uiModule.addRow()
//In an effort to follow the instructions as strictly as possible, I made this small global function to call the function in the uiModule
function addRow() {
  event.preventDefault()
  uiModule.addRow()
}
//Function that is called when the trash button is clicked on a row, which invokes the deleteRow() function in the uiModule
function deleteRowButtonClick(id) {
  uiModule.deleteRow(id)
}
//This invokes the init() function of the mainModule when the html finishes loading, so that we can inject elements into the DOM
window.onload = function() {
  mainModule.init()
}
