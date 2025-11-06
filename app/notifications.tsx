import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Bell } from 'lucide-react-native';
import { SafeAreaContainer } from '@/components/SafeAreaContainer';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Layout } from '@/constants/Layout';
import { useAuth } from '@/hooks/useAuth';
import { notificationService, Notification } from '@/services/notificationService';

interface GroupedNotifications {
  today: Notification[];
  yesterday: Notification[];
  earlier: Notification[];
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<GroupedNotifications>({
    today: [],
    yesterday: [],
    earlier: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadNotifications();
    }
  }, [user?.id]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const allNotifications = await notificationService.getUserNotifications(
        user!.id
      );
      setNotifications(groupNotificationsByDate(allNotifications));
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupNotificationsByDate = (
    notifications: Notification[]
  ): GroupedNotifications => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const grouped: GroupedNotifications = {
      today: [],
      yesterday: [],
      earlier: [],
    };

    notifications.forEach((notification) => {
      const notificationDate = new Date(notification.created_at);
      const notificationDay = new Date(
        notificationDate.getFullYear(),
        notificationDate.getMonth(),
        notificationDate.getDate()
      );

      if (notificationDay.getTime() === today.getTime()) {
        grouped.today.push(notification);
      } else if (notificationDay.getTime() === yesterday.getTime()) {
        grouped.yesterday.push(notification);
      } else {
        grouped.earlier.push(notification);
      }
    });

    return grouped;
  };

  const handleClearAll = async () => {
    try {
      await notificationService.clearAllNotifications(user!.id);
      setNotifications({
        today: [],
        yesterday: [],
        earlier: [],
      });
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const handleNotificationPress = async (notification: Notification) => {
    if (!notification.is_read) {
      try {
        await notificationService.markAsRead(notification.id);
        loadNotifications();
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
  };

  const renderNotificationCard = (notification: Notification) => (
    <TouchableOpacity
      key={notification.id}
      style={[
        styles.notificationCard,
        !notification.is_read && styles.notificationCardUnread,
      ]}
      onPress={() => handleNotificationPress(notification)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Bell size={20} color={Colors.primary.purple} />
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{notification.title}</Text>
        <Text style={styles.notificationMessage}>{notification.message}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSection = (title: string, items: Notification[]) => {
    if (items.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {items.map(renderNotificationCard)}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaContainer style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary.purple} />
        </View>
      </SafeAreaContainer>
    );
  }

  const hasNotifications =
    notifications.today.length > 0 ||
    notifications.yesterday.length > 0 ||
    notifications.earlier.length > 0;

  return (
    <SafeAreaContainer style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ChevronLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification</Text>
        <TouchableOpacity
          onPress={handleClearAll}
          style={styles.clearButton}
          activeOpacity={0.7}
          disabled={!hasNotifications}
        >
          <Text
            style={[
              styles.clearButtonText,
              !hasNotifications && styles.clearButtonTextDisabled,
            ]}
          >
            Clear
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!hasNotifications ? (
          <View style={styles.emptyContainer}>
            <Bell size={64} color={Colors.text.tertiary} />
            <Text style={styles.emptyText}>No notifications yet</Text>
            <Text style={styles.emptySubtext}>
              When you get notifications, they'll show up here
            </Text>
          </View>
        ) : (
          <>
            {renderSection('Today', notifications.today)}
            {renderSection('Yesterday', notifications.yesterday)}
            {renderSection('Earlier', notifications.earlier)}
          </>
        )}
      </ScrollView>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.background.primary,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.secondary,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: Fonts.sizes.xl,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: Layout.spacing.md,
  },

  clearButton: {
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    minWidth: 60,
    alignItems: 'flex-end',
  },

  clearButtonText: {
    fontSize: Fonts.sizes.base,
    fontWeight: Fonts.weights.medium,
    color: Colors.text.primary,
  },

  clearButtonTextDisabled: {
    color: Colors.text.tertiary,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xxl,
  },

  section: {
    marginBottom: Layout.spacing.xl,
  },

  sectionTitle: {
    fontSize: Fonts.sizes.base,
    fontWeight: Fonts.weights.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },

  notificationCard: {
    flexDirection: 'row',
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },

  notificationCardUnread: {
    borderColor: Colors.primary.purple,
    backgroundColor: 'rgba(138, 103, 255, 0.05)',
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(138, 103, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },

  notificationContent: {
    flex: 1,
  },

  notificationTitle: {
    fontSize: Fonts.sizes.base,
    fontWeight: Fonts.weights.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },

  notificationMessage: {
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.regular,
    color: Colors.text.secondary,
    lineHeight: 20,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Layout.spacing.xxl * 3,
  },

  emptyText: {
    fontSize: Fonts.sizes.xl,
    fontWeight: Fonts.weights.semibold,
    color: Colors.text.secondary,
    marginTop: Layout.spacing.xl,
    marginBottom: Layout.spacing.sm,
  },

  emptySubtext: {
    fontSize: Fonts.sizes.base,
    fontWeight: Fonts.weights.regular,
    color: Colors.text.tertiary,
    textAlign: 'center',
    paddingHorizontal: Layout.spacing.xxl,
  },
});
