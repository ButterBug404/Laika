import { StyleSheet } from 'react-native';



const styles = StyleSheet.create({
  // General container style
  containerApp: {
    flex: 1,
    backgroundColor: '#fff',
  },
  passwordContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  borderColor: '#888888',
  borderWidth: 1,
  borderRadius: 4,
  marginBottom: 12,
},
iconContainer: {
  padding: 0,
},

  errorText: {
  color: 'red',
  fontSize: 14,
  marginBottom: 12,
  textAlign: 'center',
},

  // Logo style
  logoApp: {
    width: 270,
    height: 200,
    marginTop: '15%',
    marginBottom: '2%',
    alignSelf: 'center',
  },

  // Titles and text styles
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#e25555',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle2: {
    fontSize: 18,
    color: '#820034',
    marginTop: 5,
    marginHorizontal: "15%",
    marginBottom: 20,
    textAlign: 'center',
  },
  toggleText: {
    color: '#e25555',
    margin: 10,
    marginBottom: 50,
    textAlign: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },

  // Input and picker styles
  input: {
    width: '90%',
    backgroundColor: '#ffffff',
    color: '#000000',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#dddddd',
    alignSelf: 'center',
  },
  picker: {
    width: '90%',
    backgroundColor: '#ffffff',
    color: '#000000',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#dddddd',
    alignSelf: 'center',
  },

  // Button styles
  button: {
    width: '90%',
    backgroundColor: '#820034',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    alignSelf: 'center',
  },

  // Card style
  card: {
    flex: 1,
    marginVertical: 0,
    marginHorizontal: 0,
    borderRadius: 5,
    overflow: 'hidden',
    resizeMode: "cover",
    pointerEvents: "box-none",
  },
  logoCuenta: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#ccc',
  },
    containerCuenta: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    alignItems: 'center',
    paddingTop: 20,
  },
});

export default styles 
