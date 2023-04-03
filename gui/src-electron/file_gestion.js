import { getGPath, isActualGPathValid } from "./storage";

const fs = require("fs");

function prepareDir(gPath) {
  let dir = gPath + "/garrysmod/data/e2files/e2shared/datafiles/e2imageloader";

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  /*
  for (let i = 1; i <= 16; i++) {
    if (fs.existsSync(dir + "/image" + i + ".txt"))
      fs.unlinkSync(dir + "/image" + i + ".txt");
  }
  */

  if (!fs.existsSync(dir + "/images")) {
    fs.mkdirSync(dir + "/images", { recursive: true });
  }

  return dir;
}

function chooseActiveImage(name) {
  if (!isActualGPathValid()) return false;

  let dir =
    getGPath() +
    "/garrysmod/data/e2files/e2shared/datafiles/e2imageloader/" +
    name;
  if (!fs.existsSync(dir)) {
    return false;
  }

  for (let i = 1; i <= 16; i++) {
    if (!fs.existsSync(dir + "/image" + i + ".txt")) return false;
    fs.copyFileSync(
      dir + "/image" + i + ".txt",
      getGPath() +
        "/garrysmod/data/e2files/e2shared/datafiles/e2imageloader/image" +
        i +
        ".txt"
    );
  }
  return true;
}

function deleteSavedImage(name, data) {
  let dir =
    getGPath() + "/garrysmod/data/e2files/e2shared/datafiles/e2imageloader";
  //Delete if active
  if (data.active) {
    for (let i = 1; i <= 16; i++) {
      if (fs.existsSync(dir + "/image" + i + ".txt"))
        fs.unlinkSync(dir + "/image" + i + ".txt");
    }
  }
  //Delete files data
  let dir2 = dir + "/" + name;
  for (let i = 1; i <= 16; i++) {
    if (fs.existsSync(dir2 + "/image" + i + ".txt"))
      fs.unlinkSync(dir2 + "/image" + i + ".txt");
  }
  if (fs.existsSync(dir2)) fs.rmdirSync(dir2);
  //Delete 512x512 image copy
  if (fs.existsSync(dir + "/images/" + name + data.ext))
    fs.unlinkSync(dir + "/images/" + name + data.ext);
}

export { prepareDir, chooseActiveImage, deleteSavedImage };
