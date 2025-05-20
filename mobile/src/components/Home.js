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
  const [itens, setItens] = useState([]);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    if (isFocused) carregarItens();
  }, [isFocused]);

  const carregarItens = async () => {
    try {
      const res = await api.get('/itens');
      setItens(res.data);
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível carregar itens.');
    }
  };

  const toggleComprado = async item => {
    try {
      await api.put(`/itens/${item.id}`, { ...item, comprado: !item.comprado });
      setItens(prev =>
        prev.map(i => i.id === item.id ? { ...i, comprado: !i.comprado } : i)
      );
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível atualizar.');
    }
  };

  const excluirItem = id => {
    Alert.alert(
      'Excluir item?',
      'Confirmar para deletar.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/itens/${id}`);
              carregarItens();
            } catch (err) {
              console.error(err);
              Alert.alert('Erro', 'Não foi possível excluir.');
            }
          }
        }
      ]
    );
  };

  const filtrados = itens.filter(i =>
    i.nome.toLowerCase().includes(busca.toLowerCase())
  );
  const comprados = itens.filter(i => i.comprado).length;
  const total = itens.length;
  const progresso = total ? (comprados / total) * 100 : 0;

  return (
    <SafeAreaView style={styles.container}>
      {}
      <View style={styles.header}>
        <Image source={require('../assets/header-logo.png')} style={styles.logo} />
        <Text style={styles.title}>MONSTER COLLECTION</Text>
      </View>

      { }
      <TextInput
        placeholder="Buscar item..."
        placeholderTextColor="#aaa"
        style={styles.searchBar}
        value={busca}
        onChangeText={setBusca}
      />

      { }
      <Text style={styles.counter}>
        {`Minhas Monstrinhas: ${comprados} de ${total}`}
      </Text>
      <View style={styles.barBackground}>
        <LinearGradient
          colors={['#0000FF', '#FF1493']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.barFill, { width: `${progresso}%` }]}
        />
      </View>

      { }
      <FlatList
        data={filtrados}
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
            <Text style={styles.category}>{item.categoria}</Text>
            <Text numberOfLines={2} style={styles.description}>
              {item.descricao}
            </Text>
            <View style={styles.iconRow}>
              <TouchableOpacity
                style={styles.icon}
                onPress={() => navigation.navigate('DollInfo', { doll: item })}
              >
                <Image
                  source={require('../assets/info.png')}
                  style={styles.infoIconImage}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.icon}
                onPress={() => excluirItem(item.id)}
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

      { }
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddDoll')}
      >
        <Text style={styles.addText}>Adicionar</Text>
      </TouchableOpacity>

      { }
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
    paddingVertical: 20,
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
    fontSize: 16
  },
  barBackground: {
    height: 12,
    backgroundColor: '#333',
    borderRadius: 6,
    marginHorizontal: 40,
    marginVertical: 8,
    overflow: 'hidden'
  },
  barFill: { height: 12 },
  grid: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    justifyContent: 'space-between'
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 8
  },
  card: {
    backgroundColor: '#e0f7ff',
    borderRadius: 10,
    alignItems: 'center',
    padding: 8
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: '#ff1493'
  },
  dollImage: {
    width: '100%',
    height: 120,
    borderRadius: 6
  },
  dollName: {
    color: '#fff',
    marginTop: 6,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  category: {
    color: '#ddd',
    fontSize: 12,
    textAlign: 'center'
  },
  description: {
    color: '#aaa',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 2
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
  infoIconImage: {
    width: 24,
    height: 24
  },
  addButton: {
    backgroundColor: '#ff1493',
    paddingVertical: 14,
    marginHorizontal: 60,
    borderRadius: 12,
    alignItems: 'center',
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center'
  },
  addText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 80
  }
});
