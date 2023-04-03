const Jimp = require("jimp");
const fs = require("fs");
var path = require("path");

import { getGPath, isActualGPathValid } from "./storage";
import { prepareDir } from "./file_gestion";

export async function receiveImage(ipath, wc) {
  if (!isActualGPathValid()) return;
  let dir = prepareDir(getGPath());

  let imageName = path.basename(ipath).replace(path.extname(ipath), "");

  if (!fs.existsSync(dir + "/" + imageName)) {
    fs.mkdirSync(dir + "/" + imageName, { recursive: true });
  }

  let imgdir = dir + "/" + imageName;

  var image = await Jimp.read(ipath);
  image.resize(512, 512).write(dir + "/images/" + path.basename(ipath));

  // Go through each pixel
  for (let file_nbr = 1; file_nbr <= 16; file_nbr++) {
    let line_beg = 32 * (file_nbr - 1);
    let line_end = 32 * file_nbr - 1;
    let content = "";
    for (let line_nbr = line_beg; line_nbr <= line_end; line_nbr++) {
      for (let pixel_column = 0; pixel_column <= 511; pixel_column++) {
        let pixel_color = image
          .getPixelColor(pixel_column, line_nbr)
          .toString(16)
          .padStart(8, "0")
          .slice(0, 6);
        content += pixel_color;
      }
      wc.send("tranformImageFeedback", 100 / 512);
    }

    fs.writeFileSync(imgdir + "/image" + file_nbr + ".txt", content, (err) => {
      if (err) {
        console.error(err);
      }
      // fichier écrit avec succès
    });
  }

  wc.send("transformImageDone", { name: imageName, ext: path.extname(ipath) });
  return true;
}
