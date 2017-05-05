#### What is a pattern library?

A pattern library contains the framework for building out different UI components, bundled with the functionality and support for different configurations. For instance, one might ship with a slideshow component, where size of the pictures, timing between slides, amount of pictures ect.. can be passed in by the end user, creating a  general solution instead of a one-off solution for different UI patterns

#### Outline for creating a pattern library - "lean"

To start, I'd come up with a naming convention that will be standard throughout the library, for this I'll slightly follow BEM and do something like `.lean__{componentName}`. The reason behind this is to create a class naming convention that is easy enough to type and remember, but also something that won't normally be used anywhere else, hence the name of the framework followed by the 2 underscores.

These also have to be classes, since even though ids make it a bit easier to work with on the JS side of things, having multiple of the same id is not W3C compliant. This will also allow us to utilize methods like `getElementsByClassName` which will return a dom node list which will be useful when we're attaching the functionality later.

From here, all that's left is creating the event handlers for each component that will be included in the library (appending a dark background and ability to exit a modal for instance), then applying those to each element found with a corresponding class name. This would most likely be done through an IIFE that's executed when the js script is loaded onto the page.

#### Creating dynamic components

To start, we'd need to create a new view in backbone. In backbone, you're able to pass in a collection when you initialize a new instance of a view, in the case of a table that might look something like this:

```
[
	{
    		title: 'names',
        	data: ['john', 'eric', 'tom']
    	}
]
```

Where each object is a column (though it could also be a config option to switch this to rows instead). Other possible config options could be sortable rows/columns, highlighting certain values, search/filter.

In terms of implementing these config options, each instance of a table would be capable of sorting, but the sorting method would be 'turned off' through a conditional in the sort method. This same strategy could be applied for something like highlighting certain items, which would happen in the render method.

Once we have the data being passed into the init method, we can dynamically create a template by iterating over each of the columns, and appending a new item in the column for each value in the data property. I'd imagine this method looking similar to this:

```
function render(data) {
  // basic error handling
  if(!data) {
    return '<div>This view was initialized without any data</div>';
  }
  let template = '<table><tr>'; // starting of our template
  let iteration = 0; // used to determine which iteration we're on
  const dataLen = data[0].values.length; // used to determine when to stop looping
  
  // generates the table headers
  template += data.reduce((acc, item) => {
    return acc + `<th>${item.title}</th>`;
  }, '');
  
  // assuming the view was initialized with the data in the right format
  // generates each table item in the dataset under the correct column
  // order is maintained by the original array passed in
  // caching the length of the data is also a small optimization which prevents
  // re-checking the length during each iteration
  while(iteration < dataLen){
    // Note: the closing tr is used to close off the header row
    template += '</tr><tr>';
    data.forEach((item) => {
      template += `<td>${item.values[iteration]}</td>`
    });
    template += '</tr>';
    iteration++;
  }
  // finally returns the template with the associated closing tag
  return template + '</table>';
}

const data = [
  {
    title: 'names',
    values: ['john', 'eric', 'tom']
  },
  {
    title: 'salaries',
    values: [100, 200, 300]
  },
  {
    title: 'salaries',
    values: [100, 200, 300]
  }
];


/*
  Note: This is written a little funky to get the point across
  without getting too bogged down with backbone code. Instead of
  targeting an element like this, this function would be the
  render method for our view
*/
const tableData = render(data);
document.getElementById('test').innerHTML = tableData;
```
Which can be tested here: https://codepen.io/csavage1994/pen/KmvXdb?editors=1010


With this approach, you can then create the styles for the table as a whole once and add the appropriate classes to the code above, then not have to worry about having to remake anything since the table will look and act the same across each instance, as well as be flexible in the amount of data shown.

#### Feature Walkthrough

Inside the `feature-walkthrough` directory, you can test the plugin using the following commands from within the project directory:

1. `python -m SimpleHTTPServer 8000`
2. Navigate to `localhost:8000` in your browser

Note: If the view port is too short, the buttons may appear off screen. This would be solved by getting the height of the modal and make sure we don't set the position out of bounds. Same concept would be applied for left/right bounds checking.

#### Differences between the CSS snippets

The CSS on the left is pretty raw, something you'd see if someone wasn't using any auto-prefixing or css framework.

The CSS on the right appears to be sass from the nested styling, referencing the parent selector with `&`, and variables. It's not unreasonable to think that this is also passed through an autoprefixer, since all the vendor prefixes were left out.

I'd use the second over the first for any app that I was taking seriously, using autoprefixers and interpreted languages like sass allows for the creation of cleaner code, easy selector specifity with nesting, and less bugs when doing cross browser testing.

I generally use vanilla CSS if I'm working on a one-use project that doesn't need a build process or if I simply want to get something up quickly/don't have an overly complex DOM