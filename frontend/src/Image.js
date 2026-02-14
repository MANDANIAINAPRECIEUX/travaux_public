import React, {useState, useEffect} from "react";
import axios from "axios";


function Image () {
    const [file, setFile] = useState();
    const [data, setData] = useState([]);

    const handleFile = (e) =>  {
        setFile(e.target.files[0])
    }
    useEffect(() => {
        axios.get('http://localhost:8081/')
        .then(res => {
            setData(res.data[0])
        })
        .catch(err => console.log(err));
    }, [])
    const handleUpload = () => {
        const formdata = new FormData();
        formdata.append('image',file );
        axios.post('http://localhost:8081/upload', formdata)
        .then(res => {
            if(res.data.Status === "success") {
                console.log("Succeded")
            } else {
                console.log("Failed")
            }
        })
        .catch(err => console.log(err));
    }
    return (
        <div className="container">
            <input type="file" onChange={handleFile}/>
            <button onClick={handleUpload}>Upload</button>
            <br/>
            <img src={`http://localhost:8081/images/` + data.image} alt=""/>
        </div>
    )
}

export default Image;
