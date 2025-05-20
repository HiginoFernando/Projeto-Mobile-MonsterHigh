// mobile/src/screens/Home.js
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import api from '../api';

export default function Home() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [bonecas, setBonecas] = useState([]);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    if (isFocused) carregarBonecas();
  }, [isFocused]);

  const carregarBonecas = async () => {
    try {
      const res = await api.get('/itens');
      setBonecas(res.data);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar itens.');
    }
  };

  const toggleComprado = async item => {
    try {
      await api.put(`/itens/${item.id}`, { ...item, comprado: !item.comprado });
      setBonecas(prev => prev.map(b =>
        b.id === item.id ? { ...b, comprado: !b.comprado } : b
      ));
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar.');
    }
  };

  const excluirBoneca = id => {
    Alert.alert(
      'Excluir boneca?',
      'Confirmar para deletar.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir', style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/itens/${id}`);
              carregarBonecas();
            } catch {
              Alert.alert('Erro', 'Não foi possível excluir.');
            }
          }
        }
      ]
    );
  };

  const filtradas = bonecas.filter(b =>
    b.nome.toLowerCase().includes(busca.toLowerCase())
  );
  const marcadas = bonecas.filter(b => b.comprado).length;
  const total = bonecas.length;
  const progresso = total ? marcadas / total : 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../assets/header-logo.png')} style={styles.logo} />
        <Text style={styles.title}>MONSTERCOLLECTION</Text>
      </View>

      {/* Search */}
      <TextInput
        placeholder="Buscar boneca..."
        placeholderTextColor="#aaa"
        style={styles.searchBar}
        value={busca}
        onChangeText={setBusca}
      />

      {/* Counter & Progress */}
      <Text style={styles.counter}>
        Minhas Monstrinhas: {marcadas} de {total}
      </Text>
      <View style={styles.barBackground}>
        <LinearGradient
          colors={['#0000FF', '#FF1493']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.barFill, { width: `${progresso * 100}%` }]} />
      </View>

      {/* Doll Grid */}
      <FlatList
        data={filtradas}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <TouchableOpacity
              style={[styles.card, item.comprado && styles.cardSelected]}
              onPress={() => toggleComprado(item)}
              activeOpacity={0.8}
            >
              <Image source={{ uri: item.imagem }} style={styles.dollImage} />
            </TouchableOpacity>
            <Text style={styles.dollName}>{item.nome}</Text>
            <View style={styles.iconRow}>
  {/* Info sem tintColor */}
  <TouchableOpacity
    style={styles.icon}
    onPress={() => navigation.navigate('DollInfo', { doll: item })}
  >
    <Image
      source={require('../assets/info.png')}
      style={styles.infoIconImage}
    />
  </TouchableOpacity>

  {/* Delete continua com tintColor */}
  <TouchableOpacity
    style={styles.icon}
    onPress={() => excluirBoneca(item.id)}
  >
    <Image
      source={require('../assets/delete.png')}
      style={styles.iconImage}
    />
  </TouchableOpacity>
</View>

              
          </View>
        )}
      />

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddDoll')}
      >
        <Text style={styles.addText}>Adicionar</Text>
      </TouchableOpacity>

      {/* Footer */}
      <Image
        source={require('../assets/personagens-footer.png')}
        style={styles.footer}
        resizeMode="contain"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    backgroundColor: '#ff1493',
    alignItems: 'center',
    paddingVertical: 25,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  logo: { width: 50, height: 50 },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 5 },
  searchBar: {
    backgroundColor: '#1a1a1a',
    margin: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff1493',
    color: '#fff'
  },
  counter: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 8
  },
  barBackground: {
    height: 12,
    backgroundColor: '#333',
    borderRadius: 6,
    marginHorizontal: 40,
    marginTop: 6,
    overflow: 'hidden'
  },
  barFill: { height: 12 },
  grid: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
    justifyContent: 'space-between'
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 20,
    alignItems: 'center'
  },
  card: {
    backgroundColor: '#e0f7ff',
    borderRadius: 10,
    alignItems: 'center',
    padding: 12
  },
  cardSelected: {
    borderWidth: 3,
    borderColor: '#ff1493'
  },
  dollImage: {
    width: 100,
    height: 140,
    borderRadius: 8
  },
  dollName: {
    color: '#fff',
    marginTop: 6,
    fontSize: 14,
    textAlign: 'center'
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
    marginTop: 8
  },
  icon: {
    padding: 6
  },
  iconImage: {
    width: 24,
    height: 24,
    tintColor: '#ff1493'
  },
  addButton: {
    backgroundColor: '#ff1493',
    paddingVertical: 18,
    marginHorizontal: 60,
    borderRadius: 12,
    alignItems: 'center',
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center'
  },
  addText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 80
  },
  // estilo para todos os ícones que levam tintColor (delete, check etc.)
  iconImage: {
    width: 24,
    height: 24,
    tintColor: '#ff1493',
  },

  // estilo *sem* tintColor para o Info
  infoIconImage: {
    width: 24,
    height: 24,
    // nenhuma propriedade tintColor aqui!
  },


});