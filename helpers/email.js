const articleToHTML = articleData =>
  articleData.map(data =>
    `<tr>
      <td>
        ${data.title}
      </td>
    </tr>
    <tr>
      <td>
        ${data.id}
      </td>
    </tr>
    <tr>
      <td>
        ${data.author.name}
      </td>
    </tr>`);

const generateEmail = (name, articleData) => `
    \n<body>
      <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable">
        <tr>
          <td align="center" valign="top">
            <table border="0" cellpadding="20" cellspacing="0" width="600" id="emailContainer">
              <tr>
                <td align="center" valign="top">
                  Hi ${name},
                  Here are your custom recommendations from the Arxiv today:
                </td>
              </tr>
              ${articleToHTML(articleData)}
            </table>
          </td>
        </tr>
      </table>
    </body>`;


export {
  generateEmail,
  articleToHTML
};
