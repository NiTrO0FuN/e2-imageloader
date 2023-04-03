import { reactive } from "vue";

let languageProvider = reactive({});

if (!localStorage.getItem("configLang")) {
  localStorage.setItem("configLang", "en");
}

languageProvider.language = localStorage.getItem("configLang");

languageProvider.allPhrases = {
  fr: {
    "updates.v0.0": "Sortie officielle 🔥",
    "updates.v0.1": "Support png et jpeg",
    "uploader.drop_an_image": "Glissez une ou des images (png, jpg)",
    "uploader.choosedirectory1":
      "Veuillez d'abord choisir le dossier où se situe Garry's mod en appuyant sur",
    "uploader.choosedirectory2": "en haut à droite",
    "gchooser.choosedirectory": "Choisis le dossier de Garry's mod",
    "gchooser.wrongdirectory":
      "Vous n'avez pas choisis le bon dossier de garry's mod",
    "gchooser.correctdirectory":
      "Le dossier de garry's mod a été correctement séléctioné",
    "imageshower.error": "Désolé mais cette image n'a pas pu être chargée",
  },
  en: {
    "updates.v0.0": "Official release 🔥",
    "updates.v0.1": "Now support png and jpeg",
    "uploader.drop_an_image": "Please drop one or multiple pictures (png, jpg)",
    "uploader.choosedirectory1":
      "Please first choose the folder where Garry's mod is located by clicking on",
    "uploader.choosedirectory2": "in the top right-hand corner",
    "gchooser.choosedirectory": "Choose Garry's mod folder",
    "gchooser.wrongdirectory":
      "You didn't choose the right directory for Garry's mod",
    "gchooser.correctdirectory":
      "Garry's mod's directory has correctly been selected",
    "imageshower.error": "Sorry but this image could'nt be loaded",
  },
};

languageProvider.phrases = {};

languageProvider.computePhrases = function () {
  languageProvider.phrases =
    languageProvider.allPhrases[languageProvider.language];
};

languageProvider.computePhrases();

languageProvider.getPhrase = function (string) {
  let phrase = languageProvider.phrases[string];
  return phrase ? phrase : string;
};

languageProvider.saveLang = function () {
  if (
    !languageProvider
      .getAvailableLanguages()
      .includes(languageProvider.language)
  ) {
    return;
  }
  localStorage.setItem("configLang", languageProvider.language);
  languageProvider.computePhrases();
};

languageProvider.getAvailableLanguages = function () {
  let avlL = [];
  for (const lang in languageProvider.allPhrases) {
    avlL.push(lang);
  }
  return avlL;
};

export { languageProvider };
