from langchain_text_splitters import RecursiveCharacterTextSplitter


def get_text_splitter():

    return RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )


def chunk_document(document):

    splitter = get_text_splitter()

    chunks = splitter.split_documents([document])

    return chunks