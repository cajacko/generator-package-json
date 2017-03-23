const Generator = require('yeoman-generator');

function stringToArray(string) {
  const keywords = [];

  string.split(',').forEach((keyword) => {
    if (!keyword.length) {
      return false;
    }

    return keywords.push(keyword.trim());
  });

  return keywords;
}

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.questions = [{
      type: 'input',
      name: 'name',
      message: 'name:',
      default: 'project-name'
    }, {
      type: 'input',
      name: 'version',
      message: 'version:',
      default: '0.0.1'
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
      stringToArray
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
    }];

    this.questions.forEach((question) => {
      let type = String;

      if (question.name === 'keywords') {
        type = stringToArray;
      }

      this.option(question.name, {
        type
      });
    });

    this.option('files', {
      type: stringToArray
    });
  }

  prompting() {
    const questions = [];

    this.questions.forEach((question) => {
      if (typeof this.options[question.name] === 'undefined') {
        questions.push(question);
      } else {
        this[question.name] = this.options[question.name];
      }
    });

    return this.prompt(questions).then((answers) => {
      Object.keys(answers).map((key) => {
        this[key] = answers[key];
        return this[key];
      });
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
        'version:major': 'npm version major',
        publish: 'npm publish',
        precommit: 'npm test',
        prepush: 'npm test'
      },
      engine: {
        node: this.engine
      },
      bugs: {
        email: this.authorEmail,
        url: `${this.github}/issues`
      }
    };

    if (this.options.files) {
      this.file.files = this.options.files;
    }
  }

  writing() {
    this.fs.writeJSON(this.destinationPath('./package.json'), this.file);
  }

  installPackages() {
    this.npmInstall('husky', { 'save-dev': true });
  }
};
