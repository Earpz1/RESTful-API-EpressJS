import PdfPrinter from 'pdfmake'
import imageToBase64 from 'image-to-base64'

export const getPDFReadableStream = async (blogPost) => {
  async function createBase64Img(url) {
    let base64Encoded = await imageToBase64(url)
    return 'data:image/jpeg;base64,' + base64Encoded
  }

  const fonts = {
    Courier: {
      normal: 'Courier',
      bold: 'Courier-Bold',
      italics: 'Courier-Oblique',
      bolditalics: 'Courier-BoldOblique',
    },
    Helvetica: {
      normal: 'Helvetica',
      bold: 'Helvetica-Bold',
      italics: 'Helvetica-Oblique',
      bolditalics: 'Helvetica-BoldOblique',
    },
  }

  const printer = new PdfPrinter(fonts)

  const content = [
    { image: 'coverPhoto', width: 300 },
    { text: blogPost.title },
    '\n\n',
    { text: blogPost.content },
    '\n\n',
  ]

  const docDefinition = {
    content: [...content],
    images: {
      coverPhoto: await createBase64Img(blogPost.cover),
    },
    defaultStyle: {
      font: 'Helvetica',
    },
  }

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition)
  pdfReadableStream.end()

  return pdfReadableStream
}
