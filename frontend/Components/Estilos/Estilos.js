import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // General container style
  containerApp: {
    flex: 1,
    backgroundColor: '#fff',
  },

  formContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 50,
    borderBottomLeftRadius: 0,  // Remove bottom left border radius
    borderBottomRightRadius: 0, // Remove bottom right border radius
    borderBottomWidth: 0,
    width: '100%',              // Make it full width
    marginBottom: 0,            // No margin at bottom
    paddingBottom: "80",          // Add extra padding at the bottom
    // Extend to bottom of screen
    flex: 1,
  },
  
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#888888',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 15,
    width: '90%',
    alignSelf: 'center',
  },
  
  iconContainer: {
    padding: 10,
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
    color: '#843947',
    textAlign: 'center',
    fontFamily: 'sans-serif',
  },
  
  subtitle: {
    fontSize: 15,
    color: '#e17877',
    marginBottom: 10,
    textAlign: 'center',
  },
  
  subtitle2: {
    fontSize: 18,
    color: '#af4f52',
    marginTop: 5,
    marginHorizontal: '15%',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  
  toggleText: {
    color: '#843947',
    fontWeight: 'bold',
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
    padding: 12,
    margin: 8,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
    backgroundColor: '#ffffff',
    color: '#000000',
    alignSelf: 'center',
  },
  
  inputPassword: {
    flex: 1,
    backgroundColor: '#ffffff',
    color: '#000000',
    padding: 10,
    borderRadius: 4,
  },
  
  picker: {
    width: '90%',
    padding: 8,
    margin: 8,
    backgroundColor: '#ffffff',
    color: '#000000',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'black',
    alignSelf: 'center',
  },

  // Button styles
  button: {
    width: '90%',
    height: 50,
    backgroundColor: '#b04f4f',
    padding: 12,
    margin: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#b04f4f',
    alignItems: 'center',
    alignSelf: 'center',
  },
  
  // Card style
  card: {
    flex: 1,
    overflow: 'hidden',
    resizeMode: 'cover',
    pointerEvents: 'box-none',
    // Añade estas propiedades para alinear la imagen a la izquierda y arriba
    alignItems: 'flex-start', // Alinea horizontalmente a la izquierda
    justifyContent: 'flex-start', // Alinea verticalmente arriba
    // Opcional: si quieres que solo muestre una parte de la imagen
    // puedes ajustar el width y height
    width: '100%',
    height: '100%',
  },
  
  backgroundImage: {
    // Asegúrate de que la imagen de fondo no se mueva
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
  
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start', // Changed from 'center' to 'flex-start'
    alignItems: 'center',
    paddingVertical: 20,
    width: '100%', // Ensure full width
  },
  
  keyboardAvoidingView: {
    flex: 1,
  },

  passwordHint: {
    color: '#843947',
    fontSize: 14,
    marginTop: -10,
    marginBottom: 10,
    textAlign: 'center',
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

export default styles;