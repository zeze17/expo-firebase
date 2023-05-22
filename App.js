import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert, FlatList, Modal,Pressable } from 'react-native';
import { initializeApp } from 'firebase/app';
import {getFirestore, setDoc, doc, getDoc, collection, query, where, getDocs} from 'firebase/firestore'

export default function App() {

  const firebaseConfig = {

    apiKey: "AIzaSyBzhyNVoeVlx799rSPR-UYSkt2WqTpi7Ao",
  
    authDomain: "connectdb-1967e.firebaseapp.com",
  
    projectId: "connectdb-1967e",
  
    storageBucket: "connectdb-1967e.appspot.com",
  
    messagingSenderId: "41802613471",
  
    appId: "1:41802613471:web:889476f8162a89f7e8df6a"
  
  };
  

  initializeApp(firebaseConfig);

  const sendDataToFirebase = async (userId, phone, name, age) => {
    try {
      const firestore = getFirestore();
      await setDoc(doc(firestore, 'users', userId), {
        phone: phone,
        name: name,
        age: age,
      });
      console.log('Datos guardados en Firebase.');
      // Aquí puedes añadir cualquier otra acción que desees realizar después de guardar los datos.
    } catch (error) {
      console.log('Error al guardar los datos: ', error);
    }
    clearInputs();
  };

  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');  
  const [phone, setPhone] = useState('');

  const [usuarioId, setUsuarioId] = useState('');
  const [userData, setUserData] = useState(null);
  const [users, setUsers] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);

  const clearInputs = () => {
    setUserId('');
    setPhone('');
    setName('');
    setAge('');
    setUsuarioId('');
  };

  useEffect(() => {
    fetchUsersOver30();    
  }, []);

  const getDataToFirebase = async (usuarioId) => {

    try {
      const firestore = getFirestore();
      const userDoc = doc(firestore, 'users', usuarioId);
      const docSnapshot = await getDoc(userDoc);

      if (docSnapshot.exists()) {
        setUserData(docSnapshot.data());
        console.log('El usuario si existe en la base de datos.');
        showUserInfo();
      } else {
        console.log('El usuario no existe en la base de datos.');
      }
    } catch (error) {
      console.log('Error al obtener los datos del usuario: ', error);
    }

  };

  const showUserInfo = () => {
    if (userData) {
      const { name, age, phone } = userData;
      const userInfo = `Nombre: ${name}\nEdad: ${age}\nTeléfono: ${phone}`;

      Alert.alert('Información del usuario', userInfo);
    }
  };


  const fetchUsersOver30 = async () => {
    try {
      const firestore = getFirestore();
      const usersCollection = collection(firestore, 'users');
      const usersQuery = query(usersCollection, where('age', '>', '30'));
      const querySnapshot = await getDocs(usersQuery);

      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUsers(usersData);
      
    } catch (error) {
      console.log('Error al obtener los datos de los usuarios: ', error);
    }

    console.log('los usuarios son : ', users )


  };

  const fetchUsersAll = async () => {
    try {
      const firestore = getFirestore();
      const usersCollection = collection(firestore, 'users');
      //const usersQuery = query(usersCollection, where('age', '<', '30'));
      const querySnapshot = await getDocs(usersCollection);

      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUsers(usersData);
      
    } catch (error) {
      console.log('Error al obtener los datos de los usuarios: ', error);
    }

    console.log('los usuarios son : ', users )


  };


  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };  
  

  return (
    <View style={styles.container}>

      <TextInput
        style={styles.input}
        placeholder="userId"
        onChangeText={(text) => setUserId(text)}
        value={userId}
      />

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        onChangeText={(text) => setName(text)}
        value={name}
      />
  
      <TextInput
        style={styles.input}
        placeholder="Edad"
        onChangeText={(text) => setAge(text)}
        value={age}
      />     

      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        onChangeText={(text) => setPhone(text)}
        value={phone}
      />

      <Button title='send data' onPress={() => sendDataToFirebase(userId, phone, name, age)}></Button>
      

      <TextInput
        style={styles.input}
        placeholder="userId"
        onChangeText={(text) => setUsuarioId(text)}
        value={usuarioId}
      />

      

    <Button title='buscar data' onPress={() => getDataToFirebase(usuarioId)}></Button>

    <TextInput
        style={styles.input}
        placeholder="Teléfono"
        onChangeText={(text) => setPhone(text)}
        value={phone}
      />

<Button title="Mostrar Lista > 30" onPress={toggleModal} />

<Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={toggleModal}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.title}>Lista de Todos los Usuarios</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userContainer}>
            <Text style={styles.userInfo}>ID: {item.id}</Text>
            <Text style={styles.userInfo}>Nombre: {item.name}</Text>
            <Text style={styles.userInfo}>Edad: {item.age}</Text>
            <Text style={styles.userInfo}>Teléfono: {item.phone}</Text>
          </View>
        )}
      />
      <Pressable style={styles.modalCloseButton} onPress={toggleModal}>
        <Text style={styles.modalCloseButtonText}>Cerrar</Text>
      </Pressable>
    </View>
  </View>
</Modal>

    <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  userContainer: {
    marginBottom: 12,
  },
  userInfo: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    width: '80%',
  },
  modalCloseButton: {
    marginTop: 16,
    alignSelf: 'flex-end',
  },
  modalCloseButtonText: {
    fontSize: 16,
    color: 'blue',
  }, modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    width: '80%',
  },
  modalCloseButton: {
    marginTop: 16,
    alignSelf: 'flex-end',
  },
  modalCloseButtonText: {
    fontSize: 16,
    color: 'blue',
  },
  


});
