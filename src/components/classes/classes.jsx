import React, { Component } from "react";

import stylesCSS from "./styles.module.css";

import Cookies from "js-cookie";

// Importing components

import PageHeader from "./../modules/pageHeader/pageHeader";
import SearchBar from "./../modules/searchBar/searchBar";
import SmallCard from "./../modules/smallCard/smallCard";
import AddNewCard from "./../modules/addNewCard/addNewCard";


class Classes extends Component{
    constructor(props){
        super(props);

        this.state={
            loading: true,
        };
        this.fetchData = this.fetchData.bind(this);
        this.postNewClass = this.postNewClass.bind(this);
        this.deleteClass = this.deleteClass.bind(this);
    }

    async fetchData(){
        
        const response = await fetch( process.env.REACT_APP_API_URI + "/classes/get",{
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'authorization': "Bearer ".concat(Cookies.get("jwt"))
            }
        });

        const data = await response.json();

        if(data.message){ //if we dont get classes from server but got a message
            console.log(data.message);
            return;
        }

        this.setState((state)=>{
            return { classes: data };
        });
    }

    async componentDidMount(){
        await this.fetchData();
        if(this.state.classes){
            console.log(this.state.classes);
            this.setState({loading:false});
        }
    }

    async postNewClass(){
        const newClassName = document.getElementById("newClassInput").value;

        document.getElementById("newClassInput").value = "";

        const response = await fetch(process.env.REACT_APP_API_URI + "/classes/new",{
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'authorization': "Bearer ".concat(Cookies.get("jwt"))
            },
            body: JSON.stringify({
                class: {
                    className: newClassName
                }
            })
        });

        const data = await response.json();

        console.log(data);

        await this.fetchData();
    }

    async deleteClass(id, className){
        
        var confirm = window.confirm("Confirm to Delete the class: "+className);

        if(confirm){
            const response = await fetch(process.env.REACT_APP_API_URI + "/classes/del",{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': "Bearer ".concat(Cookies.get("jwt"))
                },
                body: JSON.stringify({
                    classId: id
                })
            });
    
            const data = await response.json();
    
            console.log(data);
    
            await this.fetchData();
        }
    }

    render(){
        return(
            <div>
                <PageHeader header="Classes"/>
                <SearchBar placeholder="Search for Class"/>
                <div className={stylesCSS.cardContainer}>
                    {this.state.loading?
                    "Loading, please wait ..."
                    : 
                    this.state.classes.map((e,indx)=>{
                        return (
                            <SmallCard key={indx} href={"/classes/"+e._id} header={e.className} footer="46 Candidates" deleteHandler={async ()=> await this.deleteClass(e._id, e.className)}/>
                        )
                    })}
                </div>
                <div className={stylesCSS.addNewContainer}>
                    <AddNewCard inputId="newClassInput" placeholder="New Class" onClick={this.postNewClass}/>
                </div>
            </div>
        )
    }
}

export default Classes;