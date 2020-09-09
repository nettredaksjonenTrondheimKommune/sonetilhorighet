import React from 'react'

// const Sonetilhorighet = (props) => {
//   const options = props.results.map(r => (
//     <li key={r.navn}>
//       {r.navn}
//     </li>
//   ))
//   return <ul>{options}</ul>
// }

class Sonetilhorighet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    var { lenke, verdi } = this.props;

    return (
      <div className="box bg-blue">
        <h3>Hei</h3>
        <h4>
          <a className="underline" href={lenke}>{verdi}</a>
        </h4>
      </div>
    );
  }
}

export default Sonetilhorighet