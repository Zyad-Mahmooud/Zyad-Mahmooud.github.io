### a Picasso Plugins Architecture

a Picasso plugin are an zip app looks like

```
plugin.zip/

index.html
style.css
manifest.json
icon.png
````

#### index.html

is the main entry point that represents the actual app render


#### how it works ?

if fact, when you upload your plugin you asking for an endpoint

you: hey, i just installed this may i have an endpoint ?

Picasso: sure, here's your endpoint `/plugin/pn~918201`

this endpoint represents your application wich is loaded in an iframe laterly


#### manifest.json

````
{
  "app_name":"Picasso's awesome palette maker",
  "version": "1.0.0",
  "permissions":{
    "ACCESS_DOM_READ": true,
    "ACCESS_DOM_WRITE": false,
    "ACCESS_CSSOM_READ": true,
    "ACCESS_CSSOM_WRITE": false
  }
}
````

* the manifest are inspired by Android's AndroidManifest.xml


whenever you want to install a plugin, a permissions list appears and tells you what you should know before install it:

`ACCESS_CSSOM_WRITE: true` that's means this app can modify how your design looks automatically, however it's not bad to had an auto style editor but keep in mind unexpected errors that might breaks your design.