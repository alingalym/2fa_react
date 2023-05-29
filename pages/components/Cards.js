
function Cards() {
    
    return (
        <div className="cards">
            <Card name="Alice" job="Frontend Developer" />
            <Card name="Bob" job="Backend Developer" />
            <Card name="Charlie" job="Full Stack Developer" />
        </div>
    )
}

// Card receives an object as an argument
// We can destructure the object to get specific variables
// from inside the object - name and job
//<div className='image' />
//<img src="../pages/images/tmp.svg"/>
function Card({name, job}) {
    //let myNumber = 0;
    return (
        <div className="card">
            <div className="container">
                <h4><b>{name}</b></h4>
                <p>{job}</p>
            </div>
        </div>
    )
}

export default Cards;