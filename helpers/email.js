const formatAuthorArray = (array) => {
  const authString = array.reduce((str, auth) => str + ', ' + auth.name, '');
  return authString.slice(2);
};

const articleToHTML = articleData =>
  articleData.map((data, i) =>
    `<tr>
      <td style="text-align:center;font-size:18px;border-top:${i ? '1' : '2'}px solid grey">
        <a style="text-decoration:none" href="${data.id}" >${data.title}</a>
      </td>
    </tr>
    <tr>
      <td style="color:#4f4b4d">
        ${Array.isArray(data.author) ? formatAuthorArray(data.author) : data.author.name}
      </td>
    </tr>
    <tr>
      <td>
        ${data.summary.slice(0, 250) + '...'}
      </td>
    </tr>`);

const generateEmail = (name, articleData) => `
    \n<body>
      <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable">
        <tr>
          <td align="center" valign="top">
            <table border="0" cellpadding="10" cellspacing="0" width="600" id="emailContainer">
              <tr>
                <td align="center" valign="top" style="font-size:26px;background-color:papayawhip">
                  Hi ${name},
                  here are your current Arxiv recommendations from 
                  <a href="aita.com" style="color:#F9736C;text-decoration:none">AITA</a>
                </td>
              </tr>
              <tr>
                <td align="center" valign="top" style="font-size:20px;padding-bottom:20px;background-color:papayawhip">
                  Head over to <a href="todo" style="color:#F9736C">Your Recommendations</a> page to let us know which papers interest you, and make our system moar smartr
                </td>
              </tr>
              ${articleToHTML(articleData).join('\n')}
            </table>
          </td>
        </tr>
      </table>
    </body>`;


export {
  generateEmail,
  articleToHTML
};
