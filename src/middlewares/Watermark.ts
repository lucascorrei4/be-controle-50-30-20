import Jimp from 'jimp';

class Watermark {
  public async execute(file) {
    const newPath = file.path;
    // const newPath = `${file.path.split('.')[0]}.jpeg`;

    const LOGO = 'src/middlewares/logo.png';

    const LOGO_MARGIN_PERCENTAGE = 5;

    const main = async () => {
      const [image, logo] = await Promise.all([Jimp.read(newPath), Jimp.read(LOGO)]);

      logo.resize(image.bitmap.width / 10, Jimp.AUTO);

      const xMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;
      const yMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;

      const X = image.bitmap.width - logo.bitmap.width - xMargin;
      const Y = image.bitmap.height - logo.bitmap.height - yMargin;

      return image.composite(logo, X, Y, {
        mode: Jimp.BLEND_SCREEN,
        opacitySource: 0.1,
        opacityDest: 0.1
      });
    };

    await main().then(image => image.write(newPath));

    return newPath;
  }
}

export default new Watermark();
