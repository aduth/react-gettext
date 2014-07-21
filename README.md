Calypso-I18n
============

This plugin will install both server and client components to allow for internationalization within the calypso project. This project will be built in phases.

## Project Plan

### Phase 1
The host project will download a PO file for each language from Glotpress and parse them down to the necessary set of strings in the calypso project. Use this information to write JSON translation files for each language. The generation of these files can be triggered manually via `make`. The appropriate locale file will be loaded into the client and used by a [Jed](http://slexaxton.github.io/Jed/) instance to perform translations in the client.

The immediate goal of this phase is to define the functions that developers in the host project can start using in their javascript files to support internationalization and support them when the string exists in Glotpress.

### Phase 2
The phase 1 project assumes all translation strings already live in Glotpress. But this won't be the case. The host project will sometimes introduce new strings that need to be translated. So we also need to generate a POT file from the host project containing all necessary translation strings for the project that can be imported into Glotpress.

### Phase 3
In this phase, we will parse through the source javascript files, perform translations within the files and save a new translated javascript file for each language. The client would load the appropriate language file. So there will be no need to load a separate locale file or perform translations (outside of some logic necessary for pluralization) for in the client.

The primary difficulty here is that different languages support pluralization differently. For example, some language may have more pluralization variants than just `n=1` vs `n>1`. And the variant that we need to use may depend on a variable in the code. So we won't know at compile time which version of the text should be served. So the answer in this case will be to render (into the generated javascript for a particular language) a function that includes all pluralization translations for a given string that takes the variable as an argument.

### Phase 4
Add some automation for the upload and compiling, so we don't need to upload the POT file manually or generate the translations manually each time.

## Translation Function

Both WordPress and Jed approach translations by exposing a number of different functions/methods depending on exactly what your needs are for a given string. We could instead use a single method with optional arguments to determine the correct requirements. This is both simpler for the developer adding translation strings and simpler/safer for parsing javascript source files.

The client module will expose a single method called `translate` that takes an object with the desired options. Note, any of the optional attributes here can be combined as needed for your individual case.

```
i18n.prototype.translate = function( options ) {
}
```

### Options

* **options.text** *required* [string or pluralization object]  ([see pluralization object](#pluralization-object)) the text that needs to be translated
* **options.context** *optional* [string] provides context for ambiguous terms. For example, "post" could be a noun or a verb.
* **options.args** *optional* [array of srings or object] these are the arguments you would pass into sprintf to be run against the `text` for string substitution. [See docs](http://www.diveintojavascript.com/projects/javascript-sprintf)
* **options.comment** *optional* [string] A comment that will be shown to the translator for anything that may need to be explained about the translation.

### Pluralization Object

The pluralization object has three attributes, `single`, `plural`, and `count`.

* **single** [string] The string to display when the variable passed in `count` is singular.
* **plural** [string] The string to display when the variable passed in `count` is plural.
* **count** [integer] Pass in the variable that represents the integer which dictates whether the string is singular or plural.

### Examples

```
// simple case... just a translation, no special options
var content = i18n.translate( { text: 'My hat has three corners.' } );

// pluralization
var numHats = howManyHats(), // returns integer
    content = i18n.translate( { 
    text: {
        single: 'My hat has three corners.',
        plural: 'My hats have three corners.',
        count: numHats
    }
} );

// providing context
var content = i18n.translate( {
    text: 'post',
    context: 'verb'
} );

// add a comment to the translator
var content = i18n.translate( {
    text: 'g:i:s a',
    comment: 'draft saved date format, see http://php.net/date'
} );

// sprintf-style string substitution
// NOTE: You can also pass args as an array,
// although named arguments are more explicit and encouraged
// See http://www.diveintojavascript.com/projects/javascript-sprintf
var city = getCity(), // returns string
    zip = getZip(), // returns string
    content = i18n.translate( {
    text: 'Your city is %(city)s and your zip is %(zip)s.',
    args: {
        city: city,
        zip: zip
    }
} );
```
