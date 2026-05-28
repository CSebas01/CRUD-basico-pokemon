import React, { useEffect, useState } from "react";

import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Pokemon {
  id: string;
  name: string;
  image: string;
}

export default function CrudScreen() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  const [name, setName] = useState("");

  const [image, setImage] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);

  // =========================
  // READ (GET)
  // =========================

  useEffect(() => {
    fetch("https://graphql-pokeapi.graphcdn.app/", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        query: `
          query {
            pokemons(limit: 10) {
              results {
                id
                name
                image
              }
            }
          }
        `,
      }),
    })
      .then((res) => res.json())

      .then((data) => {
        console.log(data);

        setPokemons(data.data.pokemons.results);
      })

      .catch((error) => console.log(error));
  }, []);
  const handleAdd = () => {
    const newPokemon: Pokemon = {
      id: Date.now().toString(),

      name,

      image:
        image ||
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    };

    setPokemons([newPokemon, ...pokemons]);

    setName("");
    setImage("");
  };
  const handleUpdate = () => {
    if (!editingId) return;

    const updatedPokemons = pokemons.map((pokemon) =>
      pokemon.id === editingId
        ? {
            ...pokemon,
            name,
            image,
          }
        : pokemon,
    );

    setPokemons(updatedPokemons);

    setEditingId(null);

    setName("");
    setImage("");
  };
  const handleDelete = (id: string) => {
    const filteredPokemons = pokemons.filter((pokemon) => pokemon.id !== id);

    setPokemons(filteredPokemons);
  };
  const handleEdit = (pokemon: Pokemon) => {
    setEditingId(pokemon.id);

    setName(pokemon.name);

    setImage(pokemon.image);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CRUD Pokémon</Text>

      <TextInput
        placeholder="Nombre Pokémon"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="URL Imagen"
        placeholderTextColor="#999"
        value={image}
        onChangeText={setImage}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={editingId ? handleUpdate : handleAdd}
      >
        <Text style={styles.buttonText}>
          {editingId ? "Actualizar" : "Agregar"}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={pokemons}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{
                uri: item.image,
              }}
              style={styles.image}
            />

            <Text style={styles.cardTitle}>{item.name}</Text>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEdit(item)}
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 40,
    backgroundColor: "#121212",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#555",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    color: "white",
  },

  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#1E1E1E",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: "center",
  },

  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },

  cardTitle: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    marginBottom: 10,
  },

  actions: {
    flexDirection: "row",
    gap: 10,
  },

  editButton: {
    backgroundColor: "orange",
    padding: 10,
    borderRadius: 8,
  },

  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 8,
  },
});
