package snippet;
import java.util.Scanner;

public class Huffman {
	/**
  	 一位老木匠需要将一根长的木棒切成N段。每段的长度分别为L1,L2,......,LN（1 <= L1,L2,…,LN <= 1000，且均为整数）个长度单位。我们认为切割时仅在整数点处切且没有木材损失。
木匠发现，每一次切割花费的体力与该木棒的长度成正比，不妨设切割长度为1的木棒花费1单位体力。例如：若N=3，L1 = 3,L2 = 4,L3 = 5，则木棒原长为12，木匠可以有多种切法，如：先将12切成3+9.，花费12体力，再将9切成4+5，花费9体力，一共花费21体力；还可以先将12切成4+8，花费12体力，再将8切成3+5，花费8体力，一共花费20体力。显然，后者比前者更省体力。
那么，木匠至少要花费多少体力才能完成切割任务呢？
		输入
		第1行：1个整数N(2 <= N <= 50000)
		第2 - N + 1行：每行1个整数Li(1 <= Li <= 1000)。
		
		输出
		
		输出最小的体力消耗。
		输入示例
		3
		3
		4
		5		
		输出示例
		19

	 * @param args
	 */
    public static void main(String[] args) {
      //java 1.5后有个PriorityQueue 就是最小堆、最大堆的实现
    		Heap<Integer> heap = new Heap<Integer>();
    		
    		Scanner in=new Scanner(System.in);
    		int N=in.nextInt();
    		
    
    		for(int i=0;i<N;i++){
    			int input=in.nextInt();
    			heap.insert(input);
    		}
    	//	System.out.println(sum);
    
    
    	//	System.out.println(heap.toString());
    		
    		
    	//最小堆 64407673
    		//不断找到出现次数最少的两个“节点”合并，合并的新节点作为一个“大节点”——节点的频率是被合并两个节点的频率和
    		int min=0;//最小的体力消耗
    		for(int i=0;i<N-1;i++){
    			int temp=heap.deleteMin()+heap.deleteMin();
    			min+=temp;
    			heap.insert(temp);;
    		//	System.out.println(heap.toString());
    			
    		}
    		System.out.println(min);
    	
    	}
}
/**
      Heap<String> h = new Heap<String>();
      h.insert("p");
      h.insert("r");
      h.insert("i");
      h.insert("o");
      System.out.println(h);
      h.deleteMin();
      System.out.println(h);
      Heap<Integer> tmp = new Heap<Integer>();
      Integer[] a = {4,7,7,7,5,0,2,3,5,1};
      tmp.heapSort(a);
      System.out.println(Arrays.toString(a));
 * @author Administrator
 *
 * @param <AnyType>
 */
@SuppressWarnings("unchecked")
class Heap<AnyType extends Comparable<AnyType>>
{
   private static final int CAPACITY = 2;

   private int size;            // Number of elements in heap
   private AnyType[] heap;     // The heap array

 
public Heap()
   {
      size = 0;
      heap = (AnyType[]) new Comparable[CAPACITY];
   }

 /**
  * Construct the binary heap given an array of items.
  */
   public Heap(AnyType[] array)
   {
      size = array.length;
      heap = (AnyType[]) new Comparable[array.length+1];

      System.arraycopy(array, 0, heap, 1, array.length);//we do not use 0 index

      buildHeap();
   }
 /**
  *   runs at O(size)
  */
   private void buildHeap()
   {
      for (int k = size/2; k > 0; k--)
      {
         percolatingDown(k);
      }
   }
   private void percolatingDown(int k)
   {
      AnyType tmp = heap[k];
      int child;

      for(; 2*k <= size; k = child)
      {
         child = 2*k;

         if(child != size &&
            heap[child].compareTo(heap[child + 1]) > 0) child++;

         if(tmp.compareTo(heap[child]) > 0)  heap[k] = heap[child];
         else
                break;
      }
      heap[k] = tmp;
   }

 /**
  *  Sorts a given array of items.
  */
   public void heapSort(AnyType[] array)
   {
      size = array.length;
      heap = (AnyType[]) new Comparable[size+1];
      System.arraycopy(array, 0, heap, 1, size);
      buildHeap();

      for (int i = size; i > 0; i--)
      {
         AnyType tmp = heap[i]; //move top item to the end of the heap array
         heap[i] = heap[1];
         heap[1] = tmp;
         size--;
         percolatingDown(1);
      }
      for(int k = 0; k < heap.length-1; k++)
         array[k] = heap[heap.length - 1 - k];
   }

 /**
  * Deletes the top item
  */
   public AnyType deleteMin() throws RuntimeException
   {
      if (size == 0) throw new RuntimeException();
      AnyType min = heap[1];
      heap[1] = heap[size--];
      percolatingDown(1);
      return min;
	}

 /**
  * Inserts a new item
  */
   public void insert(AnyType x)
   {
      if(size == heap.length - 1) doubleSize();

      //Insert a new item to the end of the array
      int pos = ++size;

      //Percolate up
      for(; pos > 1 && x.compareTo(heap[pos/2]) < 0; pos = pos/2 )
         heap[pos] = heap[pos/2];

      heap[pos] = x;
   }
   private void doubleSize()
   {
      AnyType [] old = heap;
      heap = (AnyType []) new Comparable[heap.length * 2];
      System.arraycopy(old, 1, heap, 1, size);
   }

   public String toString()
   {
      String out = "";
      for(int k = 1; k <= size; k++) out += heap[k]+" ";
      return out;
   }
   
}
