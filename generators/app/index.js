const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  prompting() {
    return this.prompt([{
      type: 'input',
      name: 'name',
      message: 'name:',
      default: 'project-name'
    }, {
      type: 'input',
      name: 'version',
      message: 'version:',
      default: '1.0.0'
    }, {
      type: 'input',
      name: 'description',
      message: 'description:'
    }, {
      type: 'input',
      name: 'github',
      message: 'github url:'
    }, {
      type: 'input',
      name: 'keywords',
      message: 'keywords:',
      filter(input) {
        const keywords = [];

        input.split(',').forEach((keyword) => {
          if (!keyword.length) {
            return false;
          }

          return keywords.push(keyword.trim());
        });

        return keywords;
      }
    }, {
      type: 'input',
      name: 'authorName',
      message: 'author name:',
      store: true
    }, {
      type: 'input',
      name: 'authorEmail',
      message: 'author email:',
      store: true
    }, {
      type: 'input',
      name: 'authorUrl',
      message: 'authorUrl:',
      store: true
    }, {
      type: 'input',
      name: 'license',
      message: 'license:',
      default: 'MIT',
      store: true
    }, {
      type: 'input',
      name: 'engine',
      message: 'node engine:',
      default: '>=6.9.1',
      store: true
    }]).then((answers) => {
      this.name = answers.name;
      this.version = answers.version;
      this.description = answers.description;
      this.github = answers.github;
      this.keywords = answers.keywords;
      this.authorName = answers.authorName;
      this.authorEmail = answers.authorEmail;
      this.authorUrl = answers.authorUrl;
      this.license = answers.license;
      this.engine = answers.engine;
    });
  }

  init() {
    this.file = {
      name: this.name,
      version: this.version,
      description: this.description,
      author: {
        name: this.authorName,
        email: this.authorEmail,
        url: this.authorUrl
      },
      license: this.license,
      keywords: this.keywords,
      repository: {
        type: 'git',
        url: `${this.github}.git`
      },
      homepage: `${this.github}#readme`,
      scripts: {
        'version:patch': 'npm version patch',
        'version:minor': 'npm version minor',
        'version:major': 'npm version major'
      },
      engine: {
        node: this.engine
      },
      bugs: {
        email: this.authorEmail,
        url: `${this.github}/issues`
      }
    };
  }

  writing() {
    this.fs.writeJSON(this.destinationPath('./package.json'), this.file);
  }
};
