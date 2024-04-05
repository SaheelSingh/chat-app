//mongodb+srv://saheel:AEYsnczm5e4PQTZY@cluster0.kbhniia.mongodb.net/?retryWrites=true&w=majority
//saheel
//AEYsnczm5e4PQTZY

// import { useEffect, useState } from 'react';
import './App.css';
import Routing from './Routing';
// import SplashScreen from './SplashScreen';

function App() {

  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setLoading(false)
  //   }, 2000)
  // })

  return (
    <Routing />
    // <>
    //   {
    //     loading ? (
    //       <SplashScreen />
    //     ): (
    //       <Routing />
    //     )
    //   }
    // </>
    );
}

export default App;
