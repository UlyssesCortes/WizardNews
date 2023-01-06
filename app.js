const express = require("express");
const morgan = require("morgan");
const postBank = require("./postBank")

const app = express();

app.use(morgan("dev"))

// app.use(express.static(__dirname + "/public"));
app.use(express.static('public'))


app.get("/", (req, res) => {
  const posts = postBank.list();
  const html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      ${posts.map(post => `
        <div class='news-item'>
          <p>
            <span class="news-position">${post.id}. ▲</span>
            ${post.title}
            <small>(by ${post.name})</small>
          </p>
          <small class="news-info">
            ${post.upvotes} upvotes | ${post.date}
          </small>
          <a href="/posts/${post.id}">${post.title}</a>
        </div>`
  ).join('')}
    </div>
  </body>
</html>`
  res.send(html)
});

app.get('/posts/:id', (req, res) => {
  const id = req.params.id;
  const post = postBank.find(id);
  const html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      <p class="content">
      ${post.title}
      <small>(by ${post.name})</small>
    </p>
    <p class="content">${post.content}</p>
    <small class="news-info">
      ${post.date}
    </small>
    <a href="/">Go back</a>
    </div>
  </body>
</html>`

  const notFoundHTML = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <header><img src="/logo.png"/>Wizard News</header>
    <div class="not-found">
      <p>Accio Page! 🧙‍♀️ ... Page Not Found</p>
      <img src="https://img.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_114360-1932.jpg?w=2000" />
    </div>
  </body>
  </html>`

  if (!post.id) {
    // If the post wasn't found, just throw an error
    res.send(notFoundHTML)
  } else {
    res.send(html);
  }
});

const PORT = 1337;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
