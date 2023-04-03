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
  if (fs.existsSync(GmodPath + "/hl2.exe")) {
    return true;
  }
  return false;
}

function isGPathValid(path) {
  if (fs.existsSync(path + "/hl2.exe")) {
    return true;
  }
  return false;
}

export { getGPath, setGPath, isActualGPathValid, isGPathValid };
