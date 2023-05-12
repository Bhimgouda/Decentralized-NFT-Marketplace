import React from "react"
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader"

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
}

function Overlay({ loading }) {
    return loading ? (
        <div className="app__overlay app__overlay--light">
            <ClimbingBoxLoader loading={loading.loading} color="#007bff" />
            <h2 className="text-white">{loading.message}</h2>
        </div>
    ) : null
}

export default Overlay