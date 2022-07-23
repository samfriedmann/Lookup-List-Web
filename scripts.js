console.clear()
console.log("\nHello world, we're rocking and rolling!");

//NOT WORKING WIP
/*import {autosize} from ("./autosize");

document.addEventListener('DOMContentLoaded', function() {
    autosize(document.querySelectorAll("textarea"));
}, false);
*/

//https://www.geeksforgeeks.org/how-to-create-auto-resize-textarea-using-javascript-jquery/
document.getElementById("wordInput").addEventListener('input', autoResize);

function autoResize() {
    if (this.scrollHeight > 66) {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 10 + 'px';
    }
}

document.getElementById("defInput").addEventListener('change', autoResize);

//words = [];

document.getElementById("go").onclick = async () => {

    console.log("User clicked Look Up. Initiating lookup sequence.")

    words = document.getElementById("wordInput").value.split('\n');

    if (words.length < 2 & words[0] == "") {
        console.log("No words");
        document.getElementById("defInput").placeholder = ("No words detected. Enter your terms above and click Look Up.");
        return;
    }

    console.log("These are the terms I read:", words)

    num_sentences = document.getElementById("lengthSlider").value;
    console.log("I will get definitions from Wikipedia that are " + (num_sentences <= 1 ? "1 sentence" : num_sentences + " sentences") + " long.");

    separator = document.getElementById("separatorInput").value;

    definitionList = [];

    document.getElementById("defInput").innerHTML = ("");
    document.getElementById("defInput").placeholder = ("Looking up terms...");

    // words.forEach(lookup);
    // await Promise.all(words.map(lookup));

    //the slow (ordered) method
    for (const word of words) {
        await lookupGD(word);
        await lookupWiki(word);
        //definitionList.push(word);
    }

    //Rx.Observable.forkJoin(words)
    //.subscribe(definition => console.log(definition));

    //const wordsWithDefs = words.map(lookup);

    console.log("I'm done. Here are the definitionList: " + definitionList);

    document.getElementById("defInput").innerHTML = definitionList.join("\n");
    document.getElementById('defInput').rows = definitionList.length;
}

document.getElementById("test").onclick = () => {
    console.log("Test button clicked");
    //lookupWiki("Kanye West", 1);
}

async function lookupWiki(word, num_sentences) {

    if (word.includes('v. ')) {
        num_sentences += 1;
    }

    //https://youtu.be/RPz75gcHj18 I love this guy fr
    const url = "https://en.wikipedia.org/w/api.php?format=json&origin=*&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=" + word.replace(/\s+/g, '_');

    console.log(url);

    const result = await fetch(url);
    if (!result.ok) {
        console.log(result);
        definition = "No definition found";
    } else {
        const data = await result.json();

        let pageId = Object.keys(data.query.pages)[0];
        console.log("Wikipedia page id: ", pageId);
        definition = data.query.pages[pageId].extract;
    }

    console.log(`The definition of ${word} is: ` + definition)

   definitionList.push(word + separator + definition);
};

async function lookupGD(word, num_sentences) {

    if (word.includes('v. ')) {
        num_sentences += 1;
    }

    const url = "https://api.dictionaryapi.dev/api/v2/entries/en/" + word;

    // some of the following code is adapted from https://learnsyntax.com/lets-create-a-dictionary-with-vanilla-javascript
    // make a request to the api
    const result = await fetch(url);
    if (!result.ok) {
        console.log(result);
        definition = "No definition found";
    } else {
        const data = await result.json();
        definition = data[0].meanings[0].definitions[0].definition.toLowerCase();
    }

    console.log(`The definition of ${word} is: ` + definition)

    //return definition
    definitionList.push(word + separator + definition);
};

document.getElementById("clear").onclick = () => {

    document.getElementById("defInput").innerHTML = "";
    document.getElementById("defInput").placeholder = "";

    console.log("Cleared definitions");
}

document.getElementById("copy").onclick = () => {

    document.getElementById("defInput").select();
    document.execCommand('copy');

    console.log("Copied definitions");
}

//Dark mode
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.toggle("dark-mode");
    console.log("Dark mode detected on system");
}

window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', event => {
  if (event.matches) {
    //WIP; should update with system dark mode change
    document.body.classList.toggle("dark-mode");
  } else {
    //light mode
  }
});

document.getElementById("darkMode").onclick = () => {
    console.log(document.getElementById("darkMode").checked ? "Dark mode" : "Light mode");
    document.body.classList.toggle("dark-mode");
}