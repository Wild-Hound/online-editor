import React, { useEffect, useLayoutEffect, useRef } from "react";
import styles from "../styles/Preview.module.scss";

const { wrapper, iframeStyle } = styles;

interface Props {
  translatedCode: string;
}

const Preview: React.FC<Props> = ({ translatedCode }) => {
  const iFrame = useRef<HTMLIFrameElement>(null);

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body>
      <div id="root"></div>

      <script>
        window.addEventListener('message', (event)=>{
          
          try{
            root.innerHTML = '<div id="root"></div>'
            eval(event.data)
          } catch (err){
            const root = document.querySelector('#root');
            root.innerHTML = '<div>' + err + '</div>'
            throw err
          }

        }, false)
      </script>
    </body>
    </html>
  `;

  useLayoutEffect(() => {
    if (!iFrame?.current) {
      return;
    }

    iFrame.current?.contentWindow?.postMessage(translatedCode, "*");
  }, [translatedCode]);

  return (
    <div className={wrapper}>
      <iframe
        ref={iFrame}
        sandbox="allow-scripts"
        srcDoc={html}
        className={iframeStyle}
      />
    </div>
  );
};

export default Preview;
