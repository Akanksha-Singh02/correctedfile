import React from 'react';
import { StyleSheet, Text, View,TouchableOpacity, Image,TextInput} from 'react-native';
import * as Permissions from 'expo-permissions';
import {BarCodeScanner} from 'expo-barcode-scanner';
import firebase from "firebase";
import db from "../config"


export default class issues extends React.Component{
    constructor(){
        super();
        this.state={
            cameraPermission:null,
            scanned:false,
            scannedBookID:'',
            scannedStudentID:'',
            buttonState:"normal",
        transactionmsg : ''
        }
    }

    getCameraPermission=async id=>{
        const{status}=await Permissions.askAsync(Permissions.CAMERA)
        
        this.setState({
            cameraPermission:status==="granted",
            ButtonState:id,
            scanned:false
        })
    }

    handleBarCodeScanner=async({type,data})=>{
        const {ButtonState}=this.state
        if(ButtonState==="BookID"){
        this.setState({
            scanned:true,
            scannedBookID:data,
            buttonState:"normal"
        })
        }else if(ButtonState==="StudentId"){
            this.setState({
                scanned:true,
                scannedStudentID:data,
                buttonState:"normal"
            })  
        }
    }
    
    handledTransaction=async()=>{
        var transactionmsg = null
        db.collection("Books").doc(this.state.scannedBookID).get()
        .then((doc)=>{
            console.log(doc.data())
            console.log(this.state.scannedBookID)
        console.log(this.state.scannedStudentID)
            var book=doc.data()
            if(book.BookAvailability){
                this.initiateBookIssue();
                transactionmsg="Book Issued"
            }else{
                this.initiateBookReturn();
                transactionmsg="Book Returned"
            }
        })
        this.setState({
            transactionmsg : transactionmsg
        })
    }
    initiateBookIssue=async()=>{
        console.log("issue")
        console.log(this.state.scannedBookID)
        console.log(this.state.scannedStudentID)
        db.collection("Transaction").add({
            "StudentID":this.state.scannedStudentID,
            "BookID":this.state.scannedBookID,
            "Date":firebase.firestore.Timestamp.now().toDate(),
            "Transactiontype":"Issue"
        })
        console.log(this.state.scannedBookID)
        db.collection("Books").doc(this.state.scannedBookID).update({
          
            "BookAvailability":false
        })
        db.collection(Students).doc(this.state.scannedStudentID).update({
            "BooksIssued":firebase.firestore.FieldValue.increment(1)
        })
        this.setState({
            scannedBookID :'',
            scannedStudentID :''
        })
      
    }
    initiateBookReturn = async()=>{
        console.log("return")
        console.log(this.state.scannedBookID)
        console.log(this.state.scannedStudentID)
        db.collection("Transaction").add({
            "StudentID":this.state.scannedStudentID,
            "BookID":this.state.scannedBookID,
            "Date":firebase.firestore.Timestamp.now().toDate(),
            "Transactiontype":"Return"
        })
        console.log(this.state.scannedBookID)
        db.collection("Books").doc(this.state.scannedBookID).update({
            BookAvailability:true
        })
        db.collection("Students").doc(this.state.scannedStudentID).update({
            BooksIssued:firebase.firestore.FieldValue.increment(-1)
        })
        this.setState({
            scannedStudentID :'',
            scannedBookID : ''
        })
        
    }
    render(){
        const cameraPermission=this.state.cameraPermission;
        const scanned=this.state.scanned;
        const buttonState=this.state.buttonState
        if(buttonState!=="normal"&&cameraPermission){
            return(
                <BarCodeScanner
                onBarCodeScanned={scanned?undefined:this.handleBarCodeScanner}
                styles={StyleSheet.absoluteFillObject}/>
            );
        } 
        else if(buttonState==="normal"){
            return(
                
                <View style={styles.Container}>
                <View><Image
                source={require("../assets/booklogo.jpg")}
                style={{width:40,height:40}}
                /><Text style={{textAlign:"center",fontSize:30}}>Willy</Text>
                </View>
                <View style={styles.inputView}>
                <TextInput
                style={styles.inputBox}
                placeholder="bookID"
                onChangeText={text =>this.setState({scannedBookID:text})}
                value={this.state.scannedBookID}
                />
                <TouchableOpacity 
                style={styles.scanButton}
                onPress={()=>
                {this.getCameraPermission("BookId")}                
                }
                >
                    <Text style={styles.buttonText}>Scan</Text>
                </TouchableOpacity>
                </View>
                <View style={styles.inputView}>
                <TextInput
                style={styles.inputBox}
                placeholder="StudentID"
                onChangeText={text =>this.setState({scannedStudentID:text})}
                value={this.state.scannedStudentID}
                />
                <TouchableOpacity 
                style={styles.scanButton}
                onPress={()=>
                {this.getCameraPermission("StudentId")}                
                }
                >
                 <Text style={styles.buttonText}>Scan</Text>
                </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity 
                    style={styles.submitButton}onPress={async()=>{var transactionmsg=await this.handledTransaction();
                    this.State({
                        scannedBookID :'',
                        scannedStudentID: ''
                    })
                    
                    
                    }}>
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>
            )
        }
    }
}
const styles=StyleSheet.create({
    Container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    DisplayText:{
        fontSize:20
        //textDocumentLine:'underline',
    },
    scanButton:{
        backgroundColor:"red",
        width:50,
        borderWidth:1.5,
        borderLeftWidth:0
    },
    buttonText:{
        fontSize:20,
        textAlign:'center',
        marginTop:10,
    },
    inputView:{
        flexDirection:"row",
        margin:20,
    },
    inputBox:{
        width:200,
        height:40,
        borderWidth:1.5,
        borderRightWidth:0,
        fontSize:20
    },
    
})