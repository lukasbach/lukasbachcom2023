# My Homepage

Visit me at https://lukasbach.com

## Adding projects

Repos appear in the "My Projects" list if they are in my github user and are either

* listed in the `data/project-data.yaml` file, or
* have a `homepagedata.json` file in the root folder of the repo with the following contents:

```json5
{
  // necessary properties
  "repo": "",
  "category": "app/library/game/plugin/template/cli",

  // optional properties
  "title": "",
  "created_at": "2015-01-01T00:00:00.000Z",
  "deprecation": "",
  "highlight": false,
  
  // optional urls
  "demo": "",
  "docs": "",
  
  // optional page tokens
  "producthunt": "",
  "npm": "",
  "sonarcloud": "",

  // optional cli excerpts
  "cliexample": "",
  "npminstall": "",
}
```