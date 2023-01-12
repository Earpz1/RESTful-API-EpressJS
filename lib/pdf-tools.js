import PdfPrinter from 'pdfmake'
import base64 from 'base-64'
import imageToBase64 from 'image-to-base64'

export const getPDFReadableStream = (blogPost) => {
  try {
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

    const content = blogPost.map((post) => {
      return [
        { text: post.title },
        { image: 'cover' },
        { text: post.content },
        '\n\n',
      ]
    })

    const docDefinition = {
      content: [...content],
      images: {
        cover:
          'https://res.cloudinary.com/ddfjs3j22/image/upload/v1673474289/StriveBlog/osbpmdzvpkklm7czh06d.jpg',
      },
      defaultStyle: {
        font: 'Helvetica',
      },
    }

    const pdfReadableStream = printer.createPdfKitDocument(docDefinition)
    pdfReadableStream.end()

    return pdfReadableStream
  } catch (error) {}
}
