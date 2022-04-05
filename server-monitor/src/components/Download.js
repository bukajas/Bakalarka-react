import React from 'react'

const Download = (props) => {

    const {children} = props
    const ref = React.useRef(null);
    const downloadImage = React.useCallback(() => {
      var a = document.createElement('a');
      a.download = 'chart';
      a.href = ref.current.toBase64Image();
      a.click();
    }, []);

//<button onClick={downloadImage} className="btn-download">Download</button>

  return <p>{props.children}</p>
}

export default Download