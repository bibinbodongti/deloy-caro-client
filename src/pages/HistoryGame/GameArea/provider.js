import React from "react";

const ChangingProgressProvider = (props) => {

  const [state, setState] = React.useState({
    valuesIndex: 0
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (props.startTime === null) {
        setState({
          valuesIndex: 0
        })
        return
      }

      if(Date.now() - props.startTime > 10000)
      {
        setState({
          valuesIndex: 100
        })
      }

      setState({
        valuesIndex: (Math.floor((Date.now() - props.startTime) / 100))
      });
    }, props.interval);
    return () => clearInterval(interval);
  }, [props.startTime, props.interval])



  return (
    props.children(props.values[state.valuesIndex])
  )
}

export default ChangingProgressProvider;