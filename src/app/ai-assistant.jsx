import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, useColorScheme, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../Theme/Colors';
import { PRODUCTS } from '../constants/data'; 

const INITIAL_MESSAGE = {
  id: 'msg-1',
  text: "Hi! I'm your AI Shopping Assistant. 🛍️\n\nLooking for a specific brand, a gift under $50, or today's best deals? Just ask!",
  isUser: false,
};

export default function AIAssistantScreen() {
  const router = useRouter();
  const theme = useColorScheme() ?? 'light';
  const currentColors = Colors[theme];
  
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const flatListRef = useRef(null);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    const userMessage = { id: Date.now().toString(), text: userText, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const lowerInput = userText.toLowerCase();
      let aiResponseText = "";
      let recommendedProducts = [];

      if (lowerInput.match(/\b(hi|hello|hey)\b/)) {
        aiResponseText = "Hello there! How can I help you shop today? You can ask me for things like 'sneakers' or 'watches'.";
      } else {
        const isSneakerQuery = lowerInput.includes('sneaker') || lowerInput.includes('shoe');
        const isWatchQuery = lowerInput.includes('watch');

        const foundProducts = PRODUCTS.filter(product => {
          const titleStr = product.title.toLowerCase();
          if (isSneakerQuery && (titleStr.includes('nike') || titleStr.includes('air') || titleStr.includes('sneaker'))) return true;
          if (isWatchQuery && titleStr.includes('watch')) return true;
          return lowerInput.split(' ').some(word => word.length > 3 && titleStr.includes(word));
        });

        if (foundProducts.length > 0) {
          aiResponseText = "I found some great options for you! Tap on any of them to view details:";
          recommendedProducts = foundProducts.slice(0, 3);
        } else {
          aiResponseText = "I'm not quite sure I found a match for that. Try searching for 'Sneakers' or 'Watches'.";
        }
      }

      const aiResponse = { 
        id: (Date.now() + 1).toString(), 
        text: aiResponseText, 
        isUser: false,
        products: recommendedProducts
      };
      
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1200); 
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageBubble, 
      item.isUser ? [styles.userBubble, { backgroundColor: currentColors.primary }] : [styles.aiBubble, { backgroundColor: currentColors.surface, borderColor: currentColors.border }]
    ]}>
      <Text style={[styles.messageText, { color: item.isUser ? 'white' : currentColors.text }]}>
        {item.text}
      </Text>

      {item.products && item.products.length > 0 && (
        <View style={styles.recommendationsContainer}>
          {item.products.map(product => (
            <TouchableOpacity 
              key={product.id}
              style={[styles.chatProductCard, { backgroundColor: currentColors.background, borderColor: currentColors.border }]}
              onPress={() => router.push(`/product/${product.id}`)}
              activeOpacity={0.8}
            >
              <View style={styles.chatProductInfo}>
                <Text style={[styles.chatProductTitle, { color: currentColors.text }]} numberOfLines={1}>{product.title}</Text>
                <Text style={[styles.chatProductPrice, { color: currentColors.primary }]}>${product.price.toFixed(2)}</Text>
              </View>
              <Text style={[styles.arrowIcon, { color: currentColors.primary }]}>→</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentColors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={[styles.header, { borderBottomColor: currentColors.border }]}>
          {/* 🔥 NEW: Safe Back Navigation */}
          <TouchableOpacity 
            onPress={() => router.canGoBack() ? router.back() : router.replace('/')} 
            style={styles.backButton}
          >
            <Text style={[styles.backText, { color: currentColors.primary }]}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.headerTitleRow}>
            <Text style={styles.robotIcon}>🤖</Text>
            <Text style={[styles.headerTitle, { color: currentColors.text }]}>AI Assistant</Text>
          </View>
          <View style={{ width: 50 }} /> 
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {isTyping && (
          <View style={styles.typingContainer}>
            <ActivityIndicator size="small" color={currentColors.primary} />
            <Text style={[styles.typingText, { color: currentColors.textSecondary }]}>Searching inventory...</Text>
          </View>
        )}

        <View style={[styles.inputContainer, { backgroundColor: currentColors.surface, borderTopColor: currentColors.border }]}>
          <TextInput
            style={[styles.textInput, { backgroundColor: currentColors.background, color: currentColors.text, borderColor: currentColors.border }]}
            placeholder="Ask me anything..."
            placeholderTextColor={currentColors.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendButton, { backgroundColor: inputText.trim() ? currentColors.primary : currentColors.border }]} 
            onPress={handleSend}
            disabled={!inputText.trim() || isTyping}
          >
            <Text style={styles.sendIcon}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 15, borderBottomWidth: 1 },
  backButton: { padding: 5 },
  backText: { fontSize: 16, fontWeight: '600' },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center' },
  robotIcon: { fontSize: 24, marginRight: 8 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  
  chatContainer: { padding: 15, paddingBottom: 20 },
  messageBubble: { maxWidth: '85%', padding: 15, borderRadius: 20, marginBottom: 15 },
  userBubble: { alignSelf: 'flex-end', borderBottomRightRadius: 5 },
  aiBubble: { alignSelf: 'flex-start', borderBottomLeftRadius: 5, borderWidth: 1 },
  messageText: { fontSize: 16, lineHeight: 22 },
  
  recommendationsContainer: { marginTop: 15, gap: 10 },
  chatProductCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 10, borderWidth: 1 },
  chatProductInfo: { flex: 1, marginRight: 10 },
  chatProductTitle: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  chatProductPrice: { fontSize: 14, fontWeight: 'bold' },
  arrowIcon: { fontSize: 20, fontWeight: 'bold' },
  
  typingContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 15 },
  typingText: { marginLeft: 10, fontSize: 14, fontStyle: 'italic' },
  
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 15, borderTopWidth: 1 },
  textInput: { flex: 1, borderWidth: 1, borderRadius: 20, paddingHorizontal: 15, paddingTop: 12, paddingBottom: 12, fontSize: 16, maxHeight: 100 },
  sendButton: { width: 45, height: 45, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  sendIcon: { color: 'white', fontSize: 24, fontWeight: 'bold' }
});