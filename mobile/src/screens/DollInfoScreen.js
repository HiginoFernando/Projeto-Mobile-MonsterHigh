// mobile/src/screens/DollInfoScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import api from '../api';

export default function DollInfoScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { doll = {} } = route.params || {};

  // Inicializa FORM diretamente a partir de `doll`
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    nome: doll.nome || '',
    personagem:
      doll.descricao?.split('\n')[0]?.replace('Personagem: ', '') || '',
    numeroSerie:
      doll.descricao?.split('\n')[1]?.replace('Série: ', '') || '',
    ano: doll.descricao?.split('\n')[2]?.replace('Ano: ', '') || '',
    fabricante:
      doll.descricao?.split('\n')[3]?.replace('Fabricante: ', '') || ''
  });

  const handleSave = async () => {
    try {
      await api.put(`/itens/${doll.id}`, {
        nome: form.nome,
        categoria: doll.categoria,
        imagem: doll.imagem,
        descricao: [
          `Personagem: ${form.personagem}`,
          `Série: ${form.numeroSerie}`,
          `Ano: ${form.ano}`,
          `Fabricante: ${form.fabricante}`
        ].join('\n'),
        comprado: doll.comprado
      });
      Alert.alert('Sucesso', 'Boneca atualizada!');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível atualizar.');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Excluir boneca?',
      'Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/itens/${doll.id}`);
              Alert.alert('Removido!');
              navigation.goBack();
            } catch (err) {
              console.error(err);
              Alert.alert('Erro', 'Não foi possível remover.');
            }
          }
        }
      ]
    );
  };

  const renderField = (label, key) => (
    <View style={styles.fieldContainer} key={key}>
      <Text style={styles.label}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={form[key]}
          onChangeText={text => setForm({ ...form, [key]: text })}
        />
      ) : (
        <Text style={styles.value}>{form[key]}</Text>
      )}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../assets/header-logo.png')}
          style={styles.logo}
        />
        <Text style={styles.headerText}>MONSTERCOLLECTION</Text>
      </View>

      {/* Modal */}
      <View style={styles.modal}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>

        <Image source={{ uri: doll.imagem }} style={styles.image} />

        {renderField('Nome da Boneca:', 'nome')}
        {renderField('Personagem:', 'personagem')}
        {renderField('Número de Série:', 'numeroSerie')}
        {renderField('Ano de Lançamento:', 'ano')}
        {renderField('Fabricante:', 'fabricante')}

        <View style={styles.buttonContainer}>
          {isEditing ? (
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Text style={styles.buttonText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: '#000',
    alignItems: 'center',
    paddingTop: 140,
    paddingBottom: 40
  },
  header: {
    position: 'absolute',
    top: 0,
    width: '100%',
    backgroundColor: '#ff1493',
    paddingVertical: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  logo: {
    width: 60,
    height: 50,
    marginBottom: 4
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  },
  modal: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 20,
    width: '85%',
    alignItems: 'center',
    marginTop: 40
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10
  },
  closeText: {
    fontSize: 24,
    color: '#fff'
  },
  image: {
    width: 140,
    height: 200,
    borderRadius: 10,
    marginBottom: 12
  },
  fieldContainer: {
    alignSelf: 'stretch',
    marginVertical: 6
  },
  label: {
    fontWeight: 'bold',
    color: '#ff1493',
    marginBottom: 4
  },
  value: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4
  },
  input: {
    borderWidth: 1,
    borderColor: '#ff1493',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    color: '#fff',
    marginBottom: 4
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center'
  },
  editButton: {
    backgroundColor: '#ff1493'
  },
  saveButton: {
    backgroundColor: '#00aaff'
  },
  deleteButton: {
    backgroundColor: '#ff4d4d'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});
