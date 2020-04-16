import App from './app';

const app = new App();

app.main.listen(process.env.PORT, () => {
  console.log(`api working on port ${process.env.PORT}`);
});