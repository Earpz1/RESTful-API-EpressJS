import PdfPrinter from 'pdfmake'

export const getPDFReadableStream = (blogPost) => {
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
    return [{ text: post.title }, { text: post.content }, '\n\n']
  })

  const docDefinition = {
    content: [...content],
    defaultStyle: {
      font: 'Helvetica',
    },
  }

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition)
  pdfReadableStream.end()

  return pdfReadableStream
}
