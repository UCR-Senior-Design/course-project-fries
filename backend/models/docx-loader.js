const { BufferLoader } = require("langchain/document_loaders/fs/buffer");
const { Document } = require("langchain/document");
const mammoth = require("mammoth");

class DocxLoader extends BufferLoader {
  constructor(filePathOrBlob) {
    super(filePathOrBlob);
  }

  async parse(raw, metadata) {
    const data = await mammoth.extractRawText({ buffer: raw });
    const text = data.value;
    const meta = { source: this.filePathOrBlob, ...metadata };
    if (text) {
      return [new Document({ pageContent: text, metadata: meta })];
    }
    return [];
  }
}

module.exports = { DocxLoader };
