#[Hands for Science](http://www.handsforscience.org)
Web site containing hands-on science lessons/labs for K-6.
My wife is a teacher. She founded a non-profit to teach them.
She and others entered them using a CMS I wrote in RoR/jquery/mongodb hosted on Heroku/mLab/S3.

She closed the non-profit to work for Schmahl Science.
mLab migrated to the latest mongodb so the CMS was incompatible with the driver.

Instead of updating the CMS, I created a serverless SPA to render the content.

###lib/idMap
I converted the mongodb BSON into JSON. genIdMap command line utility (npm run genIdMap) translates the JSON into a Typescript module idMapData.
idMapModule is an API for this.

###SPA
The SPA source is in app, template, and public. webpack transpiles app into public/js. 
Stylesheets are JS-embedded. webpack.config renders template/*.html into public.
Rendering uses Typescript string interpolation.

###Testing
Tests by jest. CI by Travis. Monitoring by pingdom.

###Hosting
Attachments are stored in an S3 bucket. public is hosted in an S3 web site bucket.

###Build
```
source source.bash
npm run build
npm test
```

###Roadmap (unlikely to impl)
* analytics, capture visitor's email address
* move domain to AWS
* GraphQL, scala or typescript resolver, docker or lambda
* React rendering

