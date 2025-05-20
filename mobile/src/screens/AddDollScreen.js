
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, Image, Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../api';

export default function AddDollScreen({ navigation }) {
  const [form, setForm] = useState({
    nome: '',
    url: '',
    personagem: '',
    linha: '',
    numeroSerie: '',
    ano: '',
    fabricante: '',
  });

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão Negada',
          'Precisamos de permissão para acessar sua galeria.'
        );
      }
    })();
  }, []);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const uri = asset.base64
          ? `data:${asset.type};base64,${asset.base64}`
          : asset.uri;

        setForm(prev => ({ ...prev, url: uri }));
      }
    } catch (error) {
      console.error('Erro ao abrir galeria:', error);
      Alert.alert('Erro', 'Não foi possível acessar a galeria.');
    }
  };

  const handleSalvar = async () => {
    if (!form.nome || !form.url || !form.personagem) {
      return Alert.alert(
        'Erro',
        'Preencha pelo menos nome, imagem e personagem.'
      );
    }

    const descricaoParts = [];

    if (form.personagem) descricaoParts.push(`Personagem: ${form.personagem}`);
    if (form.numeroSerie) descricaoParts.push(`Série: ${form.numeroSerie}`);
    if (form.ano) descricaoParts.push(`Ano: ${form.ano}`);
    if (form.fabricante) descricaoParts.push(`Fabricante: ${form.fabricante}`);

    const descricao = descricaoParts.join('\n');

    const payload = {
      nome: form.nome,
      imagem: form.url,
      comprado: false,
    };

    if (form.linha) payload.categoria = form.linha;
    if (descricao) payload.descricao = descricao;

    try {
      await api.post('/itens', payload);
      Alert.alert('Sucesso', 'Boneca cadastrada no servidor!');
      navigation.goBack();
    } catch (err) {
      console.error('Falha no POST /itens:', err);
      Alert.alert('Erro', 'Não foi possível salvar no servidor.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/header-logo.png')}
          style={styles.logo}
        />
        <Text style={styles.headerText}>MONSTERCOLLECTION</Text>
      </View>

      <View style={styles.formContainer}>
        {[
          { label: 'Nome', key: 'nome' },
          { label: 'Personagem', key: 'personagem' },
          { label: 'Linha/Coleção', key: 'linha' },
          { label: 'Número de Série', key: 'numeroSerie' },
          { label: 'Ano de Lançamento', key: 'ano' },
          { label: 'Fabricante', key: 'fabricante' },
        ].map(({ label, key }) => (
          <React.Fragment key={key}>
            <Text style={styles.label}>{label}:</Text>
            <TextInput
              style={styles.input}
              value={form[key]}
              onChangeText={t => handleChange(key, t)}
            />
          </React.Fragment>
        ))}

        <Text style={styles.label}>Imagem URL ou selecione da galeria:</Text>
        <TextInput
          style={styles.input}
          placeholder="Cole aqui a URL"
          value={form.url.startsWith('data:') ? '' : form.url}
          onChangeText={t => handleChange('url', t)}
        />

        <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
          <Text style={styles.galleryButtonText}>Selecionar da Galeria</Text>
        </TouchableOpacity>

        {form.url ? (
          <Image
            source={{ uri: form.url }}
            style={styles.previewImage}
          />
        ) : null}

        <TouchableOpacity style={styles.addButton} onPress={handleSalvar}>
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>

      <Image
        source={require('../assets/personagens-footer.png')}
        style={styles.footerImage}
        resizeMode="contain"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#000',
    paddingTop: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    backgroundColor: '#ff1493',
    width: '100%',
    paddingVertical: 30,
    paddingHorizontal: 16,
    marginBottom: 19,
    borderRadius: 10,
    alignItems: 'center'
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 5
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#3793db',
    paddingHorizontal: 16,
    paddingVertical: 52,
    width: '90%',
    marginVertical: 20
  },
  label: {
    color: '#e5007e',
    fontWeight: 'bold',
    marginBottom: 4,
    marginTop: 10
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 10,
    fontSize: 16
  },
  galleryButton: {
    backgroundColor: '#3793db',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center'
  },
  galleryButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  previewImage: {
    width: 120,
    height: 120,
    marginTop: 10,
    alignSelf: 'center',
    borderRadius: 8
  },
  addButton: {
    backgroundColor: '#e5007e',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center'
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  cancelButton: {
    backgroundColor: '#cce5f7',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '60%',
    marginBottom: 20
  },
  cancelButtonText: {
    color: '#000',
    fontWeight: 'bold'
  },
  footerImage: {
    width: '100%',
    height: 100,
    marginTop: 50
  },
});
