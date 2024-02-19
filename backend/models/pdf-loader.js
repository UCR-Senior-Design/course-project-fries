const {BufferLoader} = require("langchain/document_loaders/fs/buffer");
const {Document} = require("langchain/document");
const pdfjS = require("pdfjs-dist");

class PDFLoader extends BufferLoader {
  constructor(filePathOrBlob, {splitPages = true} = {}) {
    // Either file path or blob object (pdf file)
    super(filePathOrBlob);
    this.splitPages = splitPages;
  }

  // Resolves an array of Document instance, each representing a page or the entire document
  async parse(raw, metadata) {
    const pdf = await pdfjS.getDocument({
      data: new Uint8Array(raw.buffer),
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
    }).promise;
    const meta = await pdf.getMetadata().catch(() => null);

    const documents = [];

    for (let i = 1; i <= pdf.numPages; i += 1) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      if (content.items.length === 0) {
        continue;
      }

      const text = content.items.map(item => item.str)
        .join("\n")
        .replace(/\x00/g, "")
        .trim();

      documents.push(
        new Document({
          pageContent: text,
          metadata: {
            ...metadata,
            pdf: {
              info: meta?.info,
              metadata: meta?.metadata,
              totalPages: pdf.numPages,
            },
            loc: {
              pageNumber: i,
            },
          },
        }),
      );
    }

    if (this.splitPages) {
      return documents;
    }

    if (documents.length === 0) {
      return [];
    }

    return [
      new Document({
        pageContent: documents.map(doc => doc.pageContent).join("\n\n"),
        metadata: {
          ...metadata,
          pdf: {
            info: meta?.info,
            metadata: meta?.metadata,
            totalPages: pdf.numPages,
          },
        },
      }),
    ];
  }
}

module.exports = {PDFLoader};
