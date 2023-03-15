// import PetriNet from 'petri-js';

// function PetrinetVisualizer() {

//   this.convertToPetri = (figures) => {
//     const model = {
//       places     : [ 'p0', 'p1' ],
//       transitions: [
//         {
//           name          : 't1',
//           preconditions : { 'p0': 1 },
//           postconditions: { 'p1': 2 },
//         },
//         {
//           name          : 't0',
//           preconditions : { 'p1': 1 },
//           postconditions: { 'p0': 1 },
//         },
//       ],
//       m0: { 'p0': 1, 'p1': 0 },
//     }
    
//     // Create an instance of a simulator.
    
//     // Create the Petri Net model:
//     return new PetriNet(document.getElementById('petrinet'), model)
//   }

// }

// module.exports = new PetrinetVisualizer();






// const fs = require('fs');
// const {XMLParser} = require('fast-xml-parser');

const PetriNet = require('petri-js');
function PetrinetVisualizer() {

  this.convertToPetri = (divId, figures) => {
    const model = {
      places     : [ 'p0', 'p1' ],
      transitions: [
        {
          name          : 't1',
          preconditions : { 'p0': 1 },
          postconditions: { 'p1': 2 },
        },
        {
          name          : 't0',
          preconditions : { 'p1': 1 },
          postconditions: { 'p0': 1 },
        },
      ],
      m0: { 'p0': 1, 'p1': 0 },
    }
    
    // Create an instance of a simulator.
    
    // Create the Petri Net model:

    return new PetriNet(document.getElementById(divId), model)
  }
}

module.exports = new PetrinetVisualizer();