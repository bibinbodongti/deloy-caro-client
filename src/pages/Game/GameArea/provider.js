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

      if(Date.now() - props.startTime > props.period)
      {
        setState({
          valuesIndex: 100
        })
      }

      setState({
        valuesIndex: (Math.floor((Date.now() - props.startTime) / (props.period /100)))
      });
    }, props.interval);
    return () => clearInterval(interval);
  }, [props.startTime, props.interval, props.period])

  console.log(props.period)
  return (
    props.children(props.values[state.valuesIndex])
  )
}

export default ChangingProgressProvider;