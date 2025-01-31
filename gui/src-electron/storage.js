import fs from "fs";

let GmodPath = "";

function getGPath() {
  return GmodPath;
}
function setGPath(newPath) {
  GmodPath = newPath;
  return GmodPath;
}

function isActualGPathValid() {
  return isGPathValid(GmodPath);
}

function isGPathValid(path) {
  if (fs.existsSync(path + "/gmod.exe")) {
    return true;
  }
  return false;
}

export { getGPath, setGPath, isActualGPathValid, isGPathValid };
